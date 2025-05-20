import { TESTIMONIALS } from "@/lib/constants";

export default function Testimonials() {
  return (
    <section className="py-16 px-6 md:px-12 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-medium text-foreground mb-4">Discover Your Mindful Retreat</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Join thousands who have found their serenity with SerenitySphere.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full"></div>
              <div className="relative z-10">
                <div className="mb-4 text-accent">
                  <i className="fas fa-quote-left text-2xl"></i>
                </div>
                <p className="text-foreground/80 mb-6">
                  {testimonial.quote}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                    <i className="fas fa-user text-primary"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{testimonial.author}</h4>
                    <p className="text-sm text-foreground/70">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
