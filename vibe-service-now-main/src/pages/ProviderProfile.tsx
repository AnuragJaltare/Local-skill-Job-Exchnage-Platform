import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function ProviderProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [provider, setProvider] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchProviderData();
    }
  }, [id]);

  const fetchProviderData = async () => {
    const [providerData, servicesData, reviewsData] = await Promise.all([
      supabase.from('providers').select('*, profiles!inner(*)').eq('id', id).single(),
      supabase.from('provider_services').select('*').eq('provider_id', id).eq('is_active', true),
      supabase.from('reviews').select('*, profiles!inner(full_name, avatar_url)').eq('provider_id', id)
    ]);

    if (providerData.data) setProvider(providerData.data);
    if (servicesData.data) setServices(servicesData.data);
    if (reviewsData.data) setReviews(reviewsData.data);
    setLoading(false);
  };

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to book a service');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const startTime = formData.get('startTime') as string;
    const notes = formData.get('notes') as string;

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + (selectedService?.duration_minutes || 60));

    const { error } = await supabase.from('bookings').insert({
      client_id: user.id,
      provider_id: id,
      service_id: selectedService?.id,
      start_time: startTime,
      end_time: endTime.toISOString(),
      amount: selectedService?.base_price || 0,
      notes,
      status: 'pending'
    });

    if (error) {
      toast.error('Failed to create booking');
    } else {
      toast.success('Booking request sent!');
      setBookingOpen(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!provider) return <div className="min-h-screen flex items-center justify-center">Provider not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <img
                    src={provider.profiles.avatar_url || '/placeholder.svg'}
                    alt={provider.profiles.full_name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-3xl">{provider.profiles.full_name}</CardTitle>
                    <CardDescription className="text-lg">{provider.tagline}</CardDescription>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{provider.rating || 0}</span>
                        <span className="text-muted-foreground">({provider.review_count || 0})</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{provider.service_radius_km} km</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{provider.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                    <div className="flex-1">
                      <h4 className="font-semibold">{service.title}</h4>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <Badge variant="secondary" className="mt-2">
                        ${service.base_price} {service.price_type === 'hourly' ? '/hr' : service.price_type === 'fixed' ? 'fixed' : '/day'}
                      </Badge>
                    </div>
                    <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => setSelectedService(service)}>Book Now</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Book {service.title}</DialogTitle>
                          <DialogDescription>Choose a date and time for your booking</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleBooking} className="space-y-4">
                          <div>
                            <Label htmlFor="startTime">Date & Time</Label>
                            <Input id="startTime" name="startTime" type="datetime-local" required />
                          </div>
                          <div>
                            <Label htmlFor="notes">Notes (optional)</Label>
                            <Textarea id="notes" name="notes" placeholder="Any special requirements..." />
                          </div>
                          <Button type="submit" className="w-full">Confirm Booking</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={review.profiles.avatar_url || '/placeholder.svg'}
                        alt={review.profiles.full_name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{review.profiles.full_name}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider.hourly_rate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Hourly Rate</p>
                    <p className="text-2xl font-bold">${provider.hourly_rate}/hr</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-medium">{provider.years_experience} years</p>
                </div>
                {provider.languages && (
                  <div>
                    <p className="text-sm text-muted-foreground">Languages</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {provider.languages.map((lang: string) => (
                        <Badge key={lang} variant="outline">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
