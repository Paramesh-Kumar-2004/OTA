// #include <iostream>
// #include <fstream>
// #include <sstream>
// #include <memory>
// #include <openssl/evp.h>
// #include <openssl/pem.h>
// #include <openssl/bio.h>
// #include <openssl/err.h>

// // Function to load public key from PEM string
// EVP_PKEY *load_public_key_from_string(const std::string &pem_str) {
//     BIO *bio = BIO_new_mem_buf(pem_str.data(), pem_str.size());
//     if (!bio) {
//         std::cerr << "Error creating BIO" << std::endl;
//         exit(EXIT_FAILURE);
//     }

//     EVP_PKEY *pkey = PEM_read_bio_PUBKEY(bio, nullptr, nullptr, nullptr);
//     BIO_free(bio);

//     if (!pkey) {
//         std::cerr << "Error loading public key from string" << std::endl;
//         exit(EXIT_FAILURE);
//     }

//     return pkey;
// }

// void rsa_encrypt(const unsigned char *data, size_t data_len, unsigned char *encrypted, size_t *encrypted_len, EVP_PKEY *pkey) {
//     EVP_PKEY_CTX *ctx = EVP_PKEY_CTX_new(pkey, nullptr);
//     if (!ctx) {
//         std::cerr << "Error creating EVP_PKEY_CTX" << std::endl;
//         exit(EXIT_FAILURE);
//     }

//     if (EVP_PKEY_encrypt_init(ctx) <= 0) {
//         std::cerr << "Error initializing encryption" << std::endl;
//         EVP_PKEY_CTX_free(ctx);
//         exit(EXIT_FAILURE);
//     }

//     if (EVP_PKEY_encrypt(ctx, encrypted, encrypted_len, data, data_len) <= 0) {
//         std::cerr << "Error encrypting data" << std::endl;
//         EVP_PKEY_CTX_free(ctx);
//         exit(EXIT_FAILURE);
//     }

//     EVP_PKEY_CTX_free(ctx);
// }

// void encrypt_file_with_rsa(const std::string &input_file_path, const std::string &output_file_path, EVP_PKEY *pkey) {
//     std::ifstream input_file(input_file_path, std::ios::binary);
//     if (!input_file) {
//         std::cerr << "Error opening input file for reading" << std::endl;
//         exit(EXIT_FAILURE);
//     }

//     std::ostringstream content_stream;
//     content_stream << input_file.rdbuf();
//     std::string content = content_stream.str();
//     input_file.close();

//     size_t encrypted_len = EVP_PKEY_size(pkey);
//     std::unique_ptr<unsigned char[]> encrypted_content(new unsigned char[encrypted_len]);

//     rsa_encrypt(reinterpret_cast<const unsigned char*>(content.data()), content.size(), encrypted_content.get(), &encrypted_len, pkey);

//     std::ofstream output_file(output_file_path, std::ios::binary);
//     if (!output_file) {
//         std::cerr << "Error opening output file for writing" << std::endl;
//         exit(EXIT_FAILURE);
//     }

//     output_file.write(reinterpret_cast<const char*>(encrypted_content.get()), encrypted_len);
//     output_file.close();
// }

// int main(int argc, char *argv[]) {
//     if (argc != 4) {
//         std::cerr << "Usage: " << argv[0] << " <public_key> <input_file_path> <output_file_path>" << std::endl;
//         return EXIT_FAILURE;
//     }

//     const std::string public_key = argv[1];  // Get the public key from the command line argument
//     const std::string input_file_path = argv[2];
//     const std::string output_file_path = argv[3];

//     EVP_PKEY *public_pkey = load_public_key_from_string(public_key);
//     encrypt_file_with_rsa(input_file_path, output_file_path, public_pkey);
//     EVP_PKEY_free(public_pkey);

//     return EXIT_SUCCESS;
// }





#include <iostream>
#include <fstream>
#include <sstream>
#include <memory>
#include <openssl/evp.h>
#include <openssl/pem.h>
#include <openssl/bio.h>
#include <openssl/err.h>

// Function to load public key from PEM string
EVP_PKEY *load_public_key_from_string(const std::string &pem_str) {
    BIO *bio = BIO_new_mem_buf(pem_str.data(), pem_str.size());
    if (!bio) {
        std::cerr << "Error creating BIO" << std::endl;
        exit(EXIT_FAILURE);
    }

    EVP_PKEY *pkey = PEM_read_bio_PUBKEY(bio, nullptr, nullptr, nullptr);
    BIO_free(bio);

    if (!pkey) {
        std::cerr << "Error loading public key from string" << std::endl;
        exit(EXIT_FAILURE);
    }

    return pkey;
}

void rsa_encrypt(const unsigned char *data, size_t data_len, unsigned char *encrypted, size_t *encrypted_len, EVP_PKEY *pkey) {
    EVP_PKEY_CTX *ctx = EVP_PKEY_CTX_new(pkey, nullptr);
    if (!ctx) {
        std::cerr << "Error creating EVP_PKEY_CTX" << std::endl;
        exit(EXIT_FAILURE);
    }

    if (EVP_PKEY_encrypt_init(ctx) <= 0) {
        std::cerr << "Error initializing encryption" << std::endl;
        EVP_PKEY_CTX_free(ctx);
        exit(EXIT_FAILURE);
    }

    if (EVP_PKEY_encrypt(ctx, encrypted, encrypted_len, data, data_len) <= 0) {
        std::cerr << "Error encrypting data" << std::endl;
        EVP_PKEY_CTX_free(ctx);
        exit(EXIT_FAILURE);
    }

    EVP_PKEY_CTX_free(ctx);
}

void encrypt_file_with_rsa(const std::string &input_file_path, const std::string &output_file_path, EVP_PKEY *pkey) {
    std::ifstream input_file(input_file_path, std::ios::binary);
    if (!input_file) {
        std::cerr << "Error opening input file for reading" << std::endl;
        exit(EXIT_FAILURE);
    }

    std::ostringstream content_stream;
    content_stream << input_file.rdbuf();
    std::string content = content_stream.str();
    input_file.close();

    size_t encrypted_len = EVP_PKEY_size(pkey);
    std::unique_ptr<unsigned char[]> encrypted_content(new unsigned char[encrypted_len]);

    rsa_encrypt(reinterpret_cast<const unsigned char*>(content.data()), content.size(), encrypted_content.get(), &encrypted_len, pkey);

    std::ofstream output_file(output_file_path, std::ios::binary);
    if (!output_file) {
        std::cerr << "Error opening output file for writing" << std::endl;
        exit(EXIT_FAILURE);
    }

    output_file.write(reinterpret_cast<const char*>(encrypted_content.get()), encrypted_len);
    output_file.close();

    // After encryption is done, log or start the next process
    std::cout << "File encryption completed successfully!" << std::endl;
    // You can call another function here to proceed to the next process.
    // Example: start_next_process();
}

int main(int argc, char *argv[]) {
    if (argc != 4) {
        std::cerr << "Usage: " << argv[0] << " <public_key> <input_file_path> <output_file_path>" << std::endl;
        return EXIT_FAILURE;
    }

    const std::string public_key = argv[1];  // Get the public key from the command line argument
    const std::string input_file_path = argv[2];
    const std::string output_file_path = argv[3];

    EVP_PKEY *public_pkey = load_public_key_from_string(public_key);
    encrypt_file_with_rsa(input_file_path, output_file_path, public_pkey);
    EVP_PKEY_free(public_pkey);

    return EXIT_SUCCESS;
}
