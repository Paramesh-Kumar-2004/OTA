#include <openssl/evp.h>
#include <openssl/pem.h>
#include <openssl/rsa.h>
#include <openssl/err.h>
#include <openssl/rand.h>
#include <nlohmann/json.hpp>
#include <archive.h>
#include <archive_entry.h>
#include <iostream>
#include <fstream>
#include <iomanip>
#include"Aesgen.cpp"
#include <sstream>
#include <vector>
#include <filesystem>
#include <openssl/sha.h> // Include for SHA256
#include <openssl/x509.h>
#include <openssl/x509v3.h>
#include <openssl/ssl.h>


 
// Function declarations

void load_private_key(const std::string &file_path, EVP_PKEY **pkey);

 
int main() {

// EVP_PKEY *rsa_key = nullptr;
    EVP_PKEY *rsa_key = nullptr;
    load_private_key("new_private_key.pem", &rsa_key);

    // Sign the file with the new private key
    sign_file_as_certificate("updateEnc2", "signature_cert.pem", rsa_key);
    std::cout << "File signed successfully, certificate stored in signature_cert.pem" << std::endl;


    // Clean up
    EVP_PKEY_free(rsa_key);

 
    return 0;
}
 

 
