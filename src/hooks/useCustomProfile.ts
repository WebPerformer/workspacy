import { useEffect, useState } from "react";
import { getCustomersProfile } from "../lib/customers";

interface Customer {
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  slug: string;
  subscription_id: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export function useCustomerProfile(slug?: string) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getCustomersProfile(slug);

      if (result.success) {
        setCustomer(result.data);
      } else {
        throw new Error("Failed to fetch customer profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerProfile();
  }, [slug]);

  return {
    customer,
    loading,
    error,
    refetch: fetchCustomerProfile,
  };
}
