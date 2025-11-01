"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, LineChart, Shield, Sparkles, Users, Lightbulb } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

export default function SobrePage() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-6 sm:py-12 lg:py-16">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 lg:space-y-12">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">{t("about.title")}</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {t("about.subtitle")}
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              {t("about.introTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {t("about.intro")}
            </p>
          </CardContent>
        </Card>

        {/* What is CNN */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              {t("about.whatIsCnnTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {t("about.whatIsCnn")}
            </p>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              {t("about.howItWorksTitle")}
            </CardTitle>
            <CardDescription>{t("about.howItWorksDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  1
                </span>
                <p className="text-muted-foreground pt-1">{t("about.step1")}</p>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  2
                </span>
                <p className="text-muted-foreground pt-1">{t("about.step2")}</p>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  3
                </span>
                <p className="text-muted-foreground pt-1">{t("about.step3")}</p>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  4
                </span>
                <p className="text-muted-foreground pt-1">{t("about.step4")}</p>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Model and Dataset */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("about.modelTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.modelDesc")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("about.datasetTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {t("about.datasetDesc")}
              </p>
              <a 
                href="https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <span>{t("about.datasetLink")}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-6 w-6" />
              {t("about.resultsTitle")}
            </CardTitle>
            <CardDescription>{t("about.resultsDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <p className="text-muted-foreground">{t("about.accuracy")}</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <p className="text-muted-foreground">{t("about.tumorDetection")}</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <p className="text-muted-foreground">{t("about.pituitaryDetection")}</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <p className="text-muted-foreground">{t("about.gliomaDetection")}</p>
              </li>
            </ul>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground italic">
                {t("about.meningiomaNote")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limitations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              {t("about.limitationsTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">⚠</span>
                <p className="text-muted-foreground">{t("about.limitation1")}</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">⚠</span>
                <p className="text-muted-foreground">{t("about.limitation2")}</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">⚠</span>
                <p className="text-muted-foreground">{t("about.limitation3")}</p>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Future Work */}
        <Card>
          <CardHeader>
            <CardTitle>{t("about.futureTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">→</span>
                <p className="text-muted-foreground">{t("about.future1")}</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">→</span>
                <p className="text-muted-foreground">{t("about.future2")}</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">→</span>
                <p className="text-muted-foreground">{t("about.future3")}</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">→</span>
                <p className="text-muted-foreground">{t("about.future4")}</p>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Technologies */}
        <Card>
          <CardHeader>
            <CardTitle>{t("about.techTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3 text-foreground">{t("about.techFrontendTitle")}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {t("about.tech1")}</li>
                <li>• {t("about.tech2")}</li>
                <li>• {t("about.tech3")}</li>
                <li>• {t("about.tech4")}</li>
                <li>• {t("about.tech5")}</li>
                <li>• {t("about.tech6")}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">{t("about.techBackendTitle")}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {t("about.tech7")}</li>
                <li>• {t("about.tech8")}</li>
                <li>• {t("about.tech9")}</li>
                <li>• {t("about.tech10")}</li>
                <li>• {t("about.tech11")}</li>
                <li>• {t("about.tech12")}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              {t("about.authorsTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground">{t("about.author1")}</p>
              <p className="text-sm text-muted-foreground/70">leon.fagundes@fatec.sp.gov.br</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("about.author2")}</p>
              <p className="text-sm text-muted-foreground/70">waldemar.junior@fatec.sp.gov.br</p>
            </div>
            <div className="pt-4 border-t">
              <p className="font-semibold text-sm">{t("about.institutionTitle")}</p>
              <p className="text-muted-foreground">{t("about.institution")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
