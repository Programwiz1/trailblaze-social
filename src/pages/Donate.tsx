
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Tree, Globe, ArrowRight, HeartHandshake } from "lucide-react";

const conservationProjects = [
  {
    id: 1,
    title: "Trail Preservation Fund",
    description: "Help maintain and preserve hiking trails for future generations",
    impact: "Every $50 helps maintain 1 mile of trail",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
    link: "https://example.com/donate/trails",
    raised: 45600,
    goal: 75000
  },
  {
    id: 2,
    title: "Wildlife Protection Initiative",
    description: "Support local wildlife conservation efforts in trail areas",
    impact: "Every $100 helps protect endangered species habitats",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    link: "https://example.com/donate/wildlife",
    raised: 28900,
    goal: 50000
  },
  {
    id: 3,
    title: "Forest Restoration Project",
    description: "Plant trees and restore damaged forest areas",
    impact: "Every $25 plants 5 new trees",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
    link: "https://example.com/donate/forest",
    raised: 34200,
    goal: 40000
  }
];

const DonatePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <HeartHandshake className="w-16 h-16 mx-auto text-nature-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Support Trail Conservation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your donation helps preserve natural trails, protect wildlife, and ensure these beautiful 
            places remain accessible for generations to come.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="glass-card p-6 rounded-lg text-center">
            <Shield className="w-10 h-10 mx-auto text-nature-600 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Trail Protection</h3>
            <p className="text-gray-600">Maintain and protect hiking trails</p>
          </div>
          
          <div className="glass-card p-6 rounded-lg text-center">
            <Tree className="w-10 h-10 mx-auto text-nature-600 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Forest Conservation</h3>
            <p className="text-gray-600">Preserve natural habitats</p>
          </div>
          
          <div className="glass-card p-6 rounded-lg text-center">
            <Globe className="w-10 h-10 mx-auto text-nature-600 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Global Impact</h3>
            <p className="text-gray-600">Support worldwide conservation</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Featured Conservation Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {conservationProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover-lift">
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">
                    ${project.raised.toLocaleString()} raised of ${project.goal.toLocaleString()}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-nature-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(project.raised / project.goal) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-nature-700 font-medium">
                  {project.impact}
                </p>
              </CardContent>
              
              <CardFooter>
                <Button asChild className="w-full">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    Donate Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-4">Partner Organizations</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" asChild>
              <a href="https://www.worldwildlife.org" target="_blank" rel="noopener noreferrer">
                World Wildlife Fund
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://www.nature.org" target="_blank" rel="noopener noreferrer">
                The Nature Conservancy
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://www.conservation.org" target="_blank" rel="noopener noreferrer">
                Conservation International
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonatePage;
