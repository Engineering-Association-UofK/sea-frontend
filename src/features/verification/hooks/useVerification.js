import { useQuery } from "@tanstack/react-query";
import { verificationService } from "../api/verification.service";

export const useVerifyCertificate = (hash) => {
  return useQuery({
    queryKey: ["verifyCertificate", hash],
    queryFn: () => verificationService.verifyCertificate(hash),
    enabled: !!hash,
    staleTime: 0,
    refetchOnMount: "always",
  });
};

export const useVerifyDocument = (hash) => {
  return useQuery({
    queryKey: ["verifyDocument", hash],
    queryFn: () => verificationService.verifyDocument(hash),
    enabled: !!hash,
    staleTime: 0,
    refetchOnMount: "always",
  });
};
