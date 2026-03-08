import { Search } from "lucide-react";
import { useState } from "react";
import { useGetAllServices } from "../../hooks/useQueries";
import { Input } from "../ui/input";
import ServiceCard from "./ServiceCard";

export default function ServiceSearch() {
  const { data: services, isLoading } = useGetAllServices();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices =
    services?.filter(
      (service) =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          placeholder="Search for services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-lg"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading services...</div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No services found</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try a different search term"
              : "No services available yet"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: service search results
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
