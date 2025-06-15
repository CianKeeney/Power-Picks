"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';

interface Raffle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  end_date: string;
}

// Define a type for the raw raffle data from the database
interface RawRaffle {
  id: string;
  title: string;
  description: string;
  image_url: string;
  end_date: string;
}

interface Ticket {
  raffle_id: string;
}

export default function UserDashboard() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRaffles = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          router.push("/login");
          return;
        }
        setUserEmail(user.email ?? null);
        // Get tickets for this user
        const { data: tickets, error: ticketError } = await supabase
          .from("raffle_tickets")
          .select("raffle_id")
          .eq("user_id", user.id);
        if (ticketError) throw ticketError;
        const raffleIds = (tickets as Ticket[])?.map((t) => t.raffle_id) || [];
        if (raffleIds.length === 0) {
          setRaffles([]);
          setLoading(false);
          return;
        }
        // Get raffles for these IDs
        const { data: rafflesData, error: raffleError } = await supabase
          .from("raffles")
          .select("id, title, description, image_url, end_date")
          .in("id", raffleIds);
        if (raffleError) throw raffleError;
        const mappedRaffles: Raffle[] = rafflesData.map((raffle: RawRaffle) => ({
          id: raffle.id,
          title: raffle.title,
          description: raffle.description,
          imageUrl: raffle.image_url,
          end_date: raffle.end_date,
        }));
        setRaffles(mappedRaffles);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load your raffles.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserRaffles();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Your Raffles</CardTitle>
              {userEmail && <div className="text-sm text-gray-500">Signed in as {userEmail}</div>}
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : raffles.length === 0 ? (
                <div>You have not entered any raffles yet.</div>
              ) : (
                <div className="space-y-4">
                  {raffles.map((raffle) => (
                    <Card key={raffle.id} className="border p-4 flex items-center gap-4">
                      {raffle.imageUrl && (
                        <Image
                          src={raffle.imageUrl}
                          alt={raffle.title}
                          width={500}
                          height={300}
                          layout="responsive"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{raffle.title}</div>
                        <div className="text-gray-600 text-sm mb-2">{raffle.description}</div>
                        <div className="text-xs text-gray-400">Ends: {new Date(raffle.end_date).toLocaleString()}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 