import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ClubCard } from "@/components/cards/ClubCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { srmClubs, clubCategories } from "@/data/clubs";
import { Search, Filter, Users } from "lucide-react";

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredClubs = srmClubs.filter((club) => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-campus-purple/5" />
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Users className="w-3 h-3 mr-1" /> Student Clubs
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore <span className="text-gradient">SRM Clubs</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Discover student clubs, connect with like-minded peers, and make the most of your campus experience.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b border-border bg-card sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {clubCategories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="rounded-full"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Clubs Grid */}
      <section className="py-12 bg-background min-h-[50vh]">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredClubs.length}</span> clubs
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>
                {selectedCategory === "all" ? "All Categories" : 
                  clubCategories.find(c => c.value === selectedCategory)?.label}
              </span>
            </div>
          </div>

          {filteredClubs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {filteredClubs.map((club) => (
                <ClubCard
                  key={club.id}
                  name={club.name}
                  description={club.description}
                  category={club.category}
                  coordinatorName={club.coordinatorName}
                  coordinatorEmail={club.coordinatorEmail}
                  coordinatorPhone={club.coordinatorPhone}
                  joinFormUrl={club.joinFormUrl}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                No clubs found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
