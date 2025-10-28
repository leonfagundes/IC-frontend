"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { Github, ChevronDown, ExternalLink, Home, Info, Image, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "./i18n-provider";

export function Navbar() {
  const { t } = useI18n();
  
  const imagemLinks = [
    { 
      nome: t("dropdown.kaggle"), 
      url: "https://www.kaggle.com/datasets?search=Brain+Tumor", 
      descricao: t("dropdown.kaggleDesc")
    },
    { 
      nome: t("dropdown.figshare"), 
      url: "https://figshare.com/search?q=brain+tumor", 
      descricao: t("dropdown.figshareDesc")
    },
    { 
      nome: t("dropdown.scienceDataBank"), 
      url: "https://www.scidb.cn/en/list?searchList=Brain%20Tumor&ordernum=", 
      descricao: t("dropdown.scienceDataBankDesc")
    },
  ];

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Espaço vazio à esquerda para balancear o layout */}
        <div className="w-9"></div>
        
        {/* Links centralizados */}
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className="text-sm font-medium relative group transition-colors flex items-center gap-2 pb-1"
          >
            <Home className="h-4 w-4 transition-transform group-hover:scale-110 duration-300" />
            <span className="relative z-10">{t("nav.home")}</span>
            <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
          </Link>
          
          <Link 
            href="/sobre" 
            className="text-sm font-medium relative group transition-colors flex items-center gap-2 pb-1"
          >
            <Info className="h-4 w-4 transition-transform group-hover:scale-110 duration-300" />
            <span className="relative z-10">{t("nav.about")}</span>
            <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium relative group transition-colors flex items-center gap-2 outline-none pb-1">
              <Image className="h-4 w-4 transition-transform group-hover:scale-110 duration-300" />
              <span className="relative z-10">{t("nav.testImages")}</span>
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180 duration-300" />
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-72">
              <DropdownMenuLabel>{t("dropdown.dataBasesTitle")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {imagemLinks.map((link) => (
                <DropdownMenuItem key={link.nome} asChild>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 cursor-pointer"
                  >
                    <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium">{link.nome}</span>
                      <span className="text-xs text-muted-foreground">{link.descricao}</span>
                    </div>
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link 
            href="/artigo-cientifico.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium relative group transition-colors flex items-center gap-2 pb-1"
          >
            <FileText className="h-4 w-4 transition-transform group-hover:scale-110 duration-300" />
            <span className="relative z-10">{t("nav.scientificArticle")}</span>
            <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
          </Link>
          
          <Link 
            href="https://github.com/leonfagundes/IC-backend" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium relative group transition-colors flex items-center gap-2 pb-1"
          >
            <Github className="h-4 w-4 transition-transform group-hover:rotate-12 duration-300" />
            <span className="relative z-10">{t("nav.github")}</span>
            <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
          </Link>
        </div>
        
        {/* Toggle de tema e idioma à direita */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
