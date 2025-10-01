import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const [providers, setProviders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('providers')
      .select(`
        *,
        profiles!inner(full_name, avatar_url),
        provider_services(title, base_price, price_type)
      `)
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching providers:', error);
    } else {
      setProviders(data || []);
    }
    setLoading(false);
  };

  const filteredProviders = providers.filter(provider =>
    provider.profiles.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Local Service Providers</h1>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, service, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={fetchProviders}>Search</Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading providers...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <Card
                key={provider.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/provider/${provider.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img
                      src={provider.profiles.avatar_url || '/placeholder.svg'}
                      alt={provider.profiles.full_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <CardTitle>{provider.profiles.full_name}</CardTitle>
                      <CardDescription>{provider.tagline}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{provider.rating || 0}</span>
                      <span className="text-muted-foreground">({provider.review_count || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{provider.service_radius_km} km radius</span>
                    </div>
                    {provider.hourly_rate && (
                      <Badge variant="secondary">${provider.hourly_rate}/hr</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
