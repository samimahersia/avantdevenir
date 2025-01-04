import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface AboutSectionProps {
  userRole: string | null;
}

export const AboutSection = ({ userRole }: AboutSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState({
    title: "À propos de nos services",
    welcome: "Bienvenue sur AvantDeVenir, votre plateforme de gestion de rendez-vous consulaires. Notre service simplifie la prise de rendez-vous et la gestion de vos démarches administratives.",
    features: "• Une prise de rendez-vous simple et rapide\n• Un suivi en temps réel de vos demandes\n• Des notifications personnalisées\n• Une interface intuitive pour gérer vos documents",
    support: "Notre équipe est là pour vous accompagner dans toutes vos démarches consulaires et assurer une expérience fluide et efficace."
  });

  return (
    <ScrollArea className="w-full h-[300px] rounded-lg border bg-card p-6 relative">
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
      
      {isEditing && userRole === "admin" ? (
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
  );
};