import VirtualAssistant from "../components/VirtualAssistant";
import { Card } from "../components/ui/card";

export default function ContactPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Our virtual assistant is here to help you with any questions about
            our services.
          </p>
        </div>

        <Card className="p-8">
          <VirtualAssistant />
        </Card>

        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="font-semibold mb-2">Quick Response</h3>
            <p className="text-sm text-muted-foreground">
              Get answers to your questions within 24 hours
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Expert Guidance</h3>
            <p className="text-sm text-muted-foreground">
              Our team will help you find the right services
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Personalized Support</h3>
            <p className="text-sm text-muted-foreground">
              Tailored recommendations based on your needs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
