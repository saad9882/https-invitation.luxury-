import React from "react";
import { notFound } from "next/navigation";
import { TEMPLATES, SAVE_THE_DATES, getTemplateById } from "@/data/templates";
import { TemplateShowcase } from "@/components/TemplateShowcase";
import { SaveTheDateCustomizer } from "@/components/SaveTheDateCustomizer";

export function generateStaticParams() {
  const tpls = TEMPLATES.map((tpl) => ({ id: tpl.id }));
  const stds = SAVE_THE_DATES.map((std) => ({ id: std.id }));
  return [...tpls, ...stds];
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function TemplatePage({ params }: PageProps) {
  const { id } = params;
  
  // Check if it's a Save the Date template
  const isSaveTheDate = SAVE_THE_DATES.find((std) => std.id === id);
  
  if (isSaveTheDate) {
    return (
      <SaveTheDateCustomizer 
        initialTemplate={isSaveTheDate} 
        allTemplates={SAVE_THE_DATES} 
      />
    );
  }

  const template = getTemplateById(id);

  if (!template) {
    notFound();
  }

  return <TemplateShowcase template={template} />;
}
