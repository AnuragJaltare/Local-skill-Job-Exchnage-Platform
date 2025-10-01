import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Wrench, GraduationCap, Utensils, Paintbrush, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { name: "Home Services", icon: Home, description: "Electricians, Plumbers, Cleaners" },
  { name: "Repair & Maintenance", icon: Wrench, description: "Handymen, Technicians" },
  { name: "Education", icon: GraduationCap, description: "Tutors, Coaches, Trainers" },
  { name: "Culinary", icon: Utensils, description: "Chefs, Caterers, Bakers" },
  { name: "Creative", icon: Paintbrush, description: "Designers, Photographers" },
];

const Landing = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">LS</span>
            </div>
            <span className="text-xl font-bold text-foreground">LocalSkill</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/search" className="text-muted-foreground hover:text-foreground transition-colors">
              Browse Services
            </Link>
            <Link to="/become-provider" className="text-muted-foreground hover:text-foreground transition-colors">
              Become a Provider
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to="/auth">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Find Local Skills,
            <br />
            <span className="text-primary">Hire with Confidence</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Connect with trusted local service providers. From home repairs to tutoring,
            find the perfect professional for your needs.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 bg-card p-2 rounded-lg shadow-lg border">
              <Input
                type="text"
                placeholder="What service do you need? (e.g., electrician, tutor, chef)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="border-0 focus-visible:ring-0 text-lg"
              />
              <Button size="lg" onClick={handleSearch} className="px-8">
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Verified Providers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">Jobs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4.9/5</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Popular Categories</h2>
          <p className="text-muted-foreground text-center mb-12">
            Explore services by category
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link key={category.name} to={`/search?category=${encodeURIComponent(category.name)}`}>
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Search & Compare</h3>
              <p className="text-muted-foreground">
                Browse verified providers, compare ratings, reviews, and prices
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Book & Pay Securely</h3>
              <p className="text-muted-foreground">
                Select your preferred time slot and pay securely through our platform
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Get It Done</h3>
              <p className="text-muted-foreground">
                Meet your provider, get the job done, and leave a review
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary to-primary/80 border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Ready to offer your skills?
              </h2>
              <p className="text-primary-foreground/90 mb-8 text-lg max-w-2xl mx-auto">
                Join hundreds of professionals earning on LocalSkill. Set your own rates,
                choose your schedule, and grow your business.
              </p>
              <Link to="/become-provider">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Become a Provider
                  <ChevronRight className="ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">LS</span>
                </div>
                <span className="text-lg font-bold">LocalSkill</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting local talent with those who need it.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/search" className="hover:text-foreground">Browse Services</Link></li>
                <li><Link to="/how-it-works" className="hover:text-foreground">How It Works</Link></li>
                <li><Link to="/safety" className="hover:text-foreground">Safety</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/become-provider" className="hover:text-foreground">Become a Provider</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link to="/resources" className="hover:text-foreground">Resources</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
                <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 LocalSkill. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
