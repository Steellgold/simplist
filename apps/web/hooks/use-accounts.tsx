"use client";

import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";

interface Account {
  id: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  accountId: string;
  scopes: string[];
}

type UseGetAccounts = {
  accounts: Account[];
  isPending: boolean;
  error: Error | null;
};

export const useGetAccounts = (): UseGetAccounts => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsPending(true);
      try {
        const { data, error } = await authClient.listAccounts();
        if (error) {
          setError(error instanceof Error ? error : new Error(String(error)));
        } else {
          setAccounts(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Une erreur est survenue"));
      } finally {
        setIsPending(false);
      }
    };

    fetchAccounts();
  }, []);

  return { accounts, isPending, error };
};