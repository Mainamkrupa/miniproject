import { ethers } from 'ethers';
import type { Certificate } from '../types/certificates';

/**
 * Generates a hash for the given certificate using keccak256.
 * @param certificate - The certificate object.
 * @returns The generated certificate hash as a string.
 */
export async function generateCertificateHash(certificate: Certificate): Promise<string> {
  const encoded = ethers.utils.defaultAbiCoder.encode(
    ['string', 'string', 'string', 'string', 'string'],
    [
      certificate.studentName,
      certificate.rollNumber,
      certificate.institution,
      certificate.course,
      certificate.issueDate,
    ]
  );

  return ethers.utils.keccak256(encoded);
}

/**
 * Generates hashes for multiple certificates.
 * @param certificates - An array of certificate objects.
 * @returns An array of certificate hashes as strings.
 */
export async function generateMultipleCertificateHashes(certificates: Certificate[]): Promise<string[]> {
  const hashes = await Promise.all(certificates.map(generateCertificateHash));
  return hashes;
}

/**
 * Simulates retrieving a download link for a certificate using its hash.
 * @param hash - The hash of the certificate.
 * @returns A simulated download link for the certificate.
 */
export async function getCertificateDownloadLink(hash: string): Promise<string> {
  // In a real-world scenario, interact with the blockchain or a decentralized storage system.
  return `https://blockchain-certificates.com/download/${hash}`;
}

/**
 * Simulates retrieving download links for multiple certificates.
 * @param hashes - An array of certificate hashes.
 * @returns An array of download links for the certificates.
 */
export async function getMultipleCertificateDownloadLinks(hashes: string[]): Promise<string[]> {
  const downloadLinks = await Promise.all(hashes.map(getCertificateDownloadLink));
  return downloadLinks;
}
