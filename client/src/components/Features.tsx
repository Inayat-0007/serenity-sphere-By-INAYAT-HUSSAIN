export default function Features() {
  return (
    <section id="features" className="py-16 px-6 md:px-12">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-medium text-foreground mb-4">Adaptive Visuals and Sounds</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            SerenitySphere creates a personalized experience that adapts to your mood and needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <i className="fas fa-film text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-heading font-medium text-foreground mb-3">Gentle Animations</h3>
            <p className="text-foreground/80">
              SerenitySphere offers smooth 3D animations that create a tranquil escape for users of all ages, with soft transitions that ease your mind.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <i className="fas fa-volume-up text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-heading font-medium text-foreground mb-3">Soothing Sounds</h3>
            <p className="text-foreground/80">
              Soft sounds adapt to your mood, enhancing relaxation and focus with carefully curated audio experiences that complement the visuals.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <i className="fas fa-eye text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-heading font-medium text-foreground mb-3">Calming Visuals</h3>
            <p className="text-foreground/80">
              Visuals are tailored to create a serene and inviting atmosphere with a beige minimal style that soothes the eyes and calms the mind.
            </p>
          </div>
        </div>
        
        <div className="mt-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-medium text-foreground mb-4">AI-Powered Mood Guidance</h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Our intelligent system helps you find the perfect experience for your current state of mind.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <i className="fas fa-brain text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-heading font-medium text-foreground mb-3">Personalized Support</h3>
              <p className="text-foreground/80">
                AI-driven guidance helps you navigate life's ups and downs with curated content that resonates with your emotional state.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <i className="fas fa-comments text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-heading font-medium text-foreground mb-3">Confused? Let's Talk</h3>
              <p className="text-foreground/80">
                Interactive chat feature offers tailored advice to enhance your well-being, helping you discover the perfect relaxation experience.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <i className="fas fa-heart text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-heading font-medium text-foreground mb-3">Mindful Reflection</h3>
              <p className="text-foreground/80">
                Unlock the power of mindful reflection to revitalize your mind and body, with guided experiences that promote inner peace.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-medium text-foreground mb-4">Seamless and Accessible Experience</h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              SerenitySphere is designed with accessibility in mind, ensuring everyone can enjoy its benefits.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <i className="fas fa-hand-pointer text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-heading font-medium text-foreground mb-3">Easy Navigation</h3>
              <p className="text-foreground/80">
                SerenitySphere offers a smooth, intuitive interface for effortless use, with clear pathways to the experiences you seek.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <i className="fas fa-microphone text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-heading font-medium text-foreground mb-3">Voice Option</h3>
              <p className="text-foreground/80">
                Voice navigation makes the platform accessible to all users, allowing hands-free control of your relaxation experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
