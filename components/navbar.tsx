"use client";

import { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { Github, ChevronDown, ExternalLink, Home, Info, Image, FileText, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "./i18n-provider";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTestImagesOpen, setMobileTestImagesOpen] = useState(false);
  const [mobileGithubOpen, setMobileGithubOpen] = useState(false);
  
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
    { 
      nome: t("dropdown.googleImages"), 
      url: "https://www.google.com/search?q=brain+tumor+mri&udm=2", 
      descricao: t("dropdown.googleImagesDesc")
    },
  ];

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between lg:justify-start">
          {/* Logo/Imagem - visível no mobile */}
          <Link href="/" className="lg:hidden">
            <NextImage 
              src="/brain_11666649.png" 
              alt="DetectIA Logo" 
              width={40} 
              height={40}
              className="object-contain"
            />
          </Link>

          {/* Menu hambúrguer - visível apenas no mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          {/* Desktop - Layout original */}
          <div className="hidden lg:flex items-center w-full">
            {/* Espaço flexível à esquerda */}
            <div className="flex-1"></div>
            
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
            href="/Artigo Iniciação Científica.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium relative group transition-colors flex items-center gap-2 pb-1"
          >
            <FileText className="h-4 w-4 transition-transform group-hover:scale-110 duration-300" />
            <span className="relative z-10">{t("nav.scientificArticle")}</span>
            <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium relative group transition-colors flex items-center gap-2 outline-none pb-1">
              <Github className="h-4 w-4 transition-transform group-hover:rotate-12 duration-300" />
              <span className="relative z-10">{t("nav.github")}</span>
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180 duration-300" />
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-72">
              <DropdownMenuLabel>{t("dropdown.githubTitle")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href="https://github.com/leonfagundes/IC-frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 cursor-pointer"
                >
                  <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">{t("dropdown.frontend")}</span>
                    <span className="text-xs text-muted-foreground">{t("dropdown.frontendDesc")}</span>
                  </div>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="https://github.com/leonfagundes/IC-backend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 cursor-pointer"
                >
                  <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">{t("dropdown.backend")}</span>
                    <span className="text-xs text-muted-foreground">{t("dropdown.backendDesc")}</span>
                  </div>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            </div>
            
            {/* Espaço flexível à direita com botões - Desktop */}
            <div className="flex-1 flex items-center justify-end gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="mt-4 pb-4 space-y-4 border-t pt-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-accent transition-all duration-200 animate-in fade-in slide-in-from-top-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">{t("nav.home")}</span>
            </Link>
            
            <Link 
              href="/sobre" 
              className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-accent transition-all duration-200 animate-in fade-in slide-in-from-top-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Info className="h-4 w-4" />
              <span className="text-sm font-medium">{t("nav.about")}</span>
            </Link>
            
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <button 
                className="flex items-center justify-between w-full gap-2 py-2 px-2 text-sm font-medium hover:bg-accent rounded-md transition-all duration-200"
                onClick={() => setMobileTestImagesOpen(!mobileTestImagesOpen)}
              >
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <span>{t("nav.testImages")}</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${mobileTestImagesOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`pl-6 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${mobileTestImagesOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {imagemLinks.map((link) => (
                  <a
                    key={link.nome}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 py-2 px-2 rounded-md hover:bg-accent transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{link.nome}</span>
                      <span className="text-xs text-muted-foreground">{link.descricao}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            <Link 
              href="/Artigo Iniciação Científica.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-accent transition-all duration-200 animate-in fade-in slide-in-from-top-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">{t("nav.scientificArticle")}</span>
            </Link>
            
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <button 
                className="flex items-center justify-between w-full gap-2 py-2 px-2 text-sm font-medium hover:bg-accent rounded-md transition-all duration-200"
                onClick={() => setMobileGithubOpen(!mobileGithubOpen)}
              >
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  <span>{t("nav.github")}</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${mobileGithubOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`pl-6 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${mobileGithubOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <a
                  href="https://github.com/leonfagundes/IC-frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 py-2 px-2 rounded-md hover:bg-accent transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ExternalLink className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{t("dropdown.frontend")}</span>
                    <span className="text-xs text-muted-foreground">{t("dropdown.frontendDesc")}</span>
                  </div>
                </a>
                <a
                  href="https://github.com/leonfagundes/IC-backend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 py-2 px-2 rounded-md hover:bg-accent transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ExternalLink className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{t("dropdown.backend")}</span>
                    <span className="text-xs text-muted-foreground">{t("dropdown.backendDesc")}</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Botões de tema e idioma no mobile */}
            <div className="flex items-center gap-2 pt-4 border-t animate-in fade-in slide-in-from-top-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
