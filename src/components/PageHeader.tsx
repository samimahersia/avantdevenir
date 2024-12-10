import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface PageHeaderProps {
  userType: "client" | "admin";
  setUserType: (type: "client" | "admin") => void;
  userRole: string | null;
}

export const PageHeader = ({ userType, setUserType, userRole }: PageHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState({
    title: "À propos de nos services",
    welcome: "Bienvenue sur AvantDeVenir, votre plateforme de gestion de rendez-vous consulaires. Notre service simplifie la prise de rendez-vous et la gestion de vos démarches administratives.",
    features: "• Une prise de rendez-vous simple et rapide\n• Un suivi en temps réel de vos demandes\n• Des notifications personnalisées\n• Une interface intuitive pour gérer vos documents",
    support: "Notre équipe est là pour vous accompagner dans toutes vos démarches consulaires et assurer une expérience fluide et efficace."
  });

  return (
    <CardHeader className="text-center pb-3 p-0">
      <div className="max-w-full mx-auto space-y-3">
        <div className="relative flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-1/2 h-40 md:h-48 lg:h-80 overflow-hidden rounded-t-lg md:rounded-lg shadow-inner">
            <img
              src="https://images.unsplash.com/photo-1606327054629-64c8b0fd6e4f"
              alt="Agenda professionnel"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent shadow-2xl"></div>
          </div>
          
          <ScrollArea className="w-full md:w-1/2 h-40 md:h-48 lg:h-80 rounded-lg border bg-card p-4 relative">
            {userRole === "admin" && !isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            
            {isEditing ? (
              <div className="space-y-4">
                <Textarea
                  value={aboutText.title}
                  onChange={(e) => setAboutText({ ...aboutText, title: e.target.value })}
                  className="font-semibold"
                />
                <Textarea
                  value={aboutText.welcome}
                  onChange={(e) => setAboutText({ ...aboutText, welcome: e.target.value })}
                />
                <Textarea
                  value={aboutText.features}
                  onChange={(e) => setAboutText({ ...aboutText, features: e.target.value })}
                />
                <Textarea
                  value={aboutText.support}
                  onChange={(e) => setAboutText({ ...aboutText, support: e.target.value })}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>
                    Enregistrer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                <h3 className="font-semibold mb-2 text-foreground">{aboutText.title}</h3>
                <p className="mb-4">{aboutText.welcome}</p>
                <p className="mb-4 whitespace-pre-line">
                  Nous proposons :
                  {aboutText.features}
                </p>
                <p>{aboutText.support}</p>
              </div>
            )}
          </ScrollArea>
        </div>
        
        <div className="px-2 md:px-6">
          <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3 md:mb-4">
            AvantDeVenir
          </CardTitle>
          
          <div className="hidden md:flex flex-col sm:flex-row justify-center gap-4 mt-4 md:mt-6 mb-6 md:mb-8">
            {userRole !== "admin" && (
              <Button
                size="lg"
                variant={userType === "client" ? "default" : "outline"}
                onClick={() => setUserType("client")}
                className="w-full sm:w-auto"
              >
                Mode Client
              </Button>
            )}
            {userRole === "admin" && (
              <Button
                size="lg"
                variant={userType === "admin" ? "default" : "outline"}
                onClick={() => setUserType("admin")}
                className="w-full sm:w-auto"
              >
                Mode Administrateur
              </Button>
            )}
          </div>
        </div>
      </div>
    </CardHeader>
  );
};