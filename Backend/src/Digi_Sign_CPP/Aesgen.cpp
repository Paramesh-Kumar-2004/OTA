#include <openssl/evp.h>
#include <openssl/pem.h>
#include <openssl/rsa.h>
#include <openssl/err.h>
#include <openssl/rand.h>
#include <openssl/ssl.h>
#include <nlohmann/json.hpp>
#include <vector>
#include <iostream>
#include <fstream>
#include <iomanip>
#include <sstream>
#include <archive.h>
#include <archive_entry.h>
#include <cstring>
#include <filesystem>
#include <cstdlib> // For system()

void load_private_key(const std::string &file_path, EVP_PKEY **pkey) {
    BIO *bio = BIO_new_file(file_path.c_str(), "r");
    if (!bio) {
        std::cerr << "Error creating BIO" << std::endl;
        exit(EXIT_FAILURE);
    }
    *pkey = PEM_read_bio_PrivateKey(bio, nullptr, nullptr, nullptr);
    if (!*pkey) {
        std::cerr << "Error reading RSA private key" << std::endl;
        BIO_free(bio);
        exit(EXIT_FAILURE);
    }
    BIO_free(bio);
}
 


// Modify sign_file to store signature in an X.509 certificate
void sign_file_as_certificate(const std::string &file_path, const std::string &cert_path, EVP_PKEY *private_key) {
    // Read the file content to be signed
    std::ifstream file(file_path, std::ios::binary);
    if (!file) {
        std::cerr << "Error opening file for signing" << std::endl;
        exit(EXIT_FAILURE);
    }

    std::ostringstream content_stream;
    content_stream << file.rdbuf();
    std::string content = content_stream.str();
    file.close();

    // Create a new X.509 certificate
    X509 *cert = X509_new();
    if (!cert) {
        std::cerr << "Error creating X.509 certificate" << std::endl;
        exit(EXIT_FAILURE);
    }

    // Set certificate version
    if (X509_set_version(cert, 2) != 1) { // Version 2 for X.509 v3
        std::cerr << "Error setting certificate version" << std::endl;
        X509_free(cert);
        exit(EXIT_FAILURE);
    }

    // Set the serial number
    ASN1_INTEGER *serial = ASN1_INTEGER_new();
    ASN1_INTEGER_set(serial, 1); // Simple serial number
    X509_set_serialNumber(cert, serial);
    ASN1_INTEGER_free(serial);

    // Set validity period (1 Day)
    time_t now = time(nullptr);
    time_t end_time = now + 86400; // Calculate the end time

    ASN1_TIME *not_before = ASN1_TIME_new();
    ASN1_TIME *not_after = ASN1_TIME_new();
    ASN1_TIME_set(not_before, now);
    ASN1_TIME_set(not_after, end_time);
    X509_set_notBefore(cert, not_before);
    X509_set_notAfter(cert, not_after);

    // Print validity start and end dates
    std::cout << "Certificate Start Date/Time: " << ctime(&now);
    std::cout << "Certificate End Date/Time: " << ctime(&end_time);

    ASN1_TIME_free(not_before);
    ASN1_TIME_free(not_after);

    // Set the subject and issuer (self-signed for simplicity)
    X509_NAME *name = X509_NAME_new();
    X509_NAME_add_entry_by_txt(name, "CN", MBSTRING_ASC, (unsigned char *)"Self-Signed", -1, -1, 0);
    X509_set_subject_name(cert, name);
    X509_set_issuer_name(cert, name);
    X509_NAME_free(name);

    // Set the public key
    X509_set_pubkey(cert, private_key);

    // Create signing context
    EVP_MD_CTX *ctx = EVP_MD_CTX_create();
    if (!ctx) {
        std::cerr << "Error creating EVP_MD_CTX" << std::endl;
        X509_free(cert);
        exit(EXIT_FAILURE);
    }

    // Initialize signing operation
    if (EVP_SignInit(ctx, EVP_sha256()) != 1) {
        std::cerr << "Error initializing signing" << std::endl;
        EVP_MD_CTX_destroy(ctx);
        X509_free(cert);
        exit(EXIT_FAILURE);
    }

    // Add data to be signed (the content of the file)
    if (EVP_SignUpdate(ctx, content.data(), content.size()) != 1) {
        std::cerr << "Error updating signature" << std::endl;
        EVP_MD_CTX_destroy(ctx);
        X509_free(cert);
        exit(EXIT_FAILURE);
    }

    // Buffer for the signature
    unsigned char signature[EVP_PKEY_size(private_key)];
    unsigned int signature_len;

    // Finalize the signature
    if (EVP_SignFinal(ctx, signature, &signature_len, private_key) != 1) {
        std::cerr << "Error finalizing signature" << std::endl;
        EVP_MD_CTX_destroy(ctx);
        X509_free(cert);
        exit(EXIT_FAILURE);
    }

    EVP_MD_CTX_destroy(ctx);

    // Embed the signature into the certificate
    if (X509_sign(cert, private_key, EVP_sha256()) == 0) {
        std::cerr << "Error signing the X.509 certificate" << std::endl;
        X509_free(cert);
        exit(EXIT_FAILURE);
    }

    // Write the certificate to a file
    FILE *cert_file = fopen(cert_path.c_str(), "wb");
    if (!cert_file) {
        std::cerr << "Error opening certificate file for writing" << std::endl;
        X509_free(cert);
        exit(EXIT_FAILURE);
    }
    if (i2d_X509_fp(cert_file, cert) != 1) {
        std::cerr << "Error writing X.509 certificate" << std::endl;
        fclose(cert_file);
        X509_free(cert);
        exit(EXIT_FAILURE);
    }
    fclose(cert_file);

    // Clean up
    X509_free(cert);
}


 
 