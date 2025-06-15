'use client';

import { useEffect, useState } from 'react';
import { Raffle } from '@/types/raffle';
import { raffleService } from '@/services/raffleService';
import Image from 'next/image';

export default function Home() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchRaffles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await raffleService.getActiveRaffles();
      setRaffles(data);
    } catch (err) {
      console.error('Error fetching raffles:', err);
      setError(err instanceof Error ? err.message : 'Failed to load raffles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    fetchRaffles();
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-4">Win Amazing Prizes</h1>
            <p className="text-xl mb-8">Enter our exciting raffles for a chance to win incredible prizes. From luxury cars to dream vacations, your next big win could be just a ticket away!</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              View Active Raffles
            </button>
          </div>
        </div>
      </section>

      {/* Featured Raffles Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Raffles</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">Error loading raffles</p>
              <p className="text-sm mt-1">{error}</p>
              <button 
                onClick={fetchRaffles}
                className="mt-2 text-red-700 underline hover:text-red-800"
              >
                Try Again
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {raffles.map((raffle) => (
                <div key={raffle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={raffle.image_url}
                      alt={raffle.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{raffle.title}</h3>
                    <p className="text-gray-600 mb-4">{raffle.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold">${raffle.price}</span>
                      <span className="text-sm text-gray-500">
                        {raffle.sold_tickets} / {raffle.total_tickets} tickets sold
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(raffle.sold_tickets / raffle.total_tickets) * 100}%` }}
                      />
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Enter Raffle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
