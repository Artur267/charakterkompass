# 🚀 GCP Cloud Run Setup & Deployment Guide

## Voraussetzungen

- [x] Google Cloud Account
- [x] Billing aktiviert
- [x] GitHub Repository erstellt
- [x] `gcloud` CLI installiert ([Download](https://cloud.google.com/sdk/docs/install))

---

## 1️⃣ Erstmaliges GCP Setup (einmalig)

### GCP-Projekt erstellen
```bash
# Projekt-ID festlegen (muss unique sein!)
export PROJECT_ID="charakterkompass-prod"

# Projekt erstellen
gcloud projects create $PROJECT_ID --name="Charakterkompass"

# Projekt als aktiv setzen
gcloud config set project $PROJECT_ID

# Billing verknüpfen (WICHTIG!)
# → In GCP Console: Billing Account verknüpfen
# https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID
```

### APIs aktivieren
```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  compute.googleapis.com
```

### Artifact Registry erstellen (für Docker Images)
```bash
gcloud artifacts repositories create charakterkompass \
  --repository-format=docker \
  --location=europe-west1 \
  --description="Docker images für Charakterkompass"
```

---

## 2️⃣ Workload Identity Federation (sicher, ohne Service Account Keys!)

### Service Account erstellen
```bash
# Service Account für GitHub Actions
gcloud iam service-accounts create github-actions-deployer \
  --description="Service Account für GitHub Actions CI/CD" \
  --display-name="GitHub Actions Deployer"

# Permissions vergeben
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

### Workload Identity Pool erstellen
```bash
# Pool erstellen
gcloud iam workload-identity-pools create github-pool \
  --location="global" \
  --display-name="GitHub Actions Pool"

# Provider erstellen (GitHub)
gcloud iam workload-identity-pools providers create-oidc github-provider \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# Service Account Binding (ersetze DEIN-GITHUB-USER/charakterkompass!)
export GITHUB_REPO="DEIN-GITHUB-USER/charakterkompass"

gcloud iam service-accounts add-iam-policy-binding \
  github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')/locations/global/workloadIdentityPools/github-pool/attribute.repository/${GITHUB_REPO}"
```

### Workload Identity Provider ARN abrufen
```bash
gcloud iam workload-identity-pools providers describe github-provider \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --format="value(name)"

# Output sieht so aus:
# projects/123456789/locations/global/workloadIdentityPools/github-pool/providers/github-provider
```

---

## 3️⃣ GitHub Secrets konfigurieren

Gehe zu: **GitHub Repo → Settings → Secrets and variables → Actions**

Erstelle folgende **Repository Secrets**:

| Secret Name | Value | Beispiel |
|-------------|-------|----------|
| `GCP_PROJECT_ID` | Deine GCP Project ID | `charakterkompass-prod` |
| `WIF_PROVIDER` | Workload Identity Provider (aus Schritt 2) | `projects/123.../github-provider` |
| `WIF_SERVICE_ACCOUNT` | Service Account Email | `github-actions-deployer@....iam.gserviceaccount.com` |

---

## 4️⃣ Lokales Testing vor GitHub-Deployment

### Build & Run lokal testen
```bash
# Dependencies installieren
npm install

# Vite Build
npm run build

# Docker Image bauen
docker build -t charakterkompass:local .

# Lokal testen (Port 8080)
docker run -p 8080:8080 charakterkompass:local

# Im Browser öffnen
open http://localhost:8080
```

### Manuelles Deploy (ohne GitHub Actions)
```bash
# Authenticate
gcloud auth login
gcloud config set project $PROJECT_ID

# Docker bauen & pushen
export IMAGE_NAME="europe-west1-docker.pkg.dev/${PROJECT_ID}/charakterkompass/charakterkompass:manual"

docker build -t $IMAGE_NAME .
docker push $IMAGE_NAME

# Deploy zu Cloud Run
gcloud run deploy charakterkompass \
  --image $IMAGE_NAME \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10 \
  --memory 256Mi \
  --cpu 1 \
  --port 8080
```

---

## 5️⃣ Zero-Scaling Settings erklärt

```yaml
--min-instances 0        # Skaliert auf 0, wenn kein Traffic (keine Kosten!)
--max-instances 10       # Max 10 Container (reicht für moderate Traffic)
--memory 256Mi           # 256MB RAM (ausreichend für nginx)
--cpu 1                  # 1 vCPU
--timeout 60             # Request Timeout 60s
--concurrency 80         # 80 Requests pro Container
```

**Kosten-Kalkulation:**
- Keine Instanzen = **0€**
- Bei Traffic: ~0,00002€ pro Request (sehr günstig!)
- Beispiel: 1.000 Requests/Tag ≈ **0,60€/Monat**

---

## 6️⃣ GitHub Actions Workflow triggern

```bash
# Code committen & pushen
git add .
git commit -m "feat: Add GCP Cloud Run deployment"
git push origin main

# Workflow startet automatisch!
# → GitHub Actions → Deploy to Cloud Run
```

### Service URL abrufen
```bash
gcloud run services describe charakterkompass \
  --platform managed \
  --region europe-west1 \
  --format 'value(status.url)'

# Output: https://charakterkompass-xyz-ew.a.run.app
```

---

## 7️⃣ Custom Domain (optional)

```bash
# Domain verifizieren
gcloud domains verify charakterkompass.com

# Domain Mapping erstellen
gcloud run domain-mappings create \
  --service charakterkompass \
  --domain charakterkompass.com \
  --region europe-west1

# DNS Records hinzufügen (Output von obigem Command)
```

---

## 🔍 Monitoring & Debugging

### Logs anschauen
```bash
gcloud run services logs read charakterkompass \
  --region europe-west1 \
  --limit 50

# Live-Logs (tail)
gcloud run services logs tail charakterkompass --region europe-west1
```

### Service-Infos
```bash
gcloud run services describe charakterkompass \
  --region europe-west1
```

### Delete Service (Clean-up)
```bash
gcloud run services delete charakterkompass \
  --region europe-west1
```

---

## 🛡️ Security Best Practices

- ✅ Workload Identity statt Service Account Keys
- ✅ `--allow-unauthenticated` nur für öffentliche Apps
- ✅ Security Headers in nginx.conf (bereits gesetzt!)
- ✅ Least Privilege: Service Account nur nötige Rollen
- ✅ Artifact Registry: Private Docker Images

---

## 📝 Troubleshooting

### Problem: "Permission Denied" bei Cloud Run Deploy
```bash
# Service Account Permissions prüfen
gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:github-actions-deployer*"
```

### Problem: Docker Build schlägt fehl
```bash
# Dependencies lokal installieren
npm install

# Dockerfile Syntax prüfen
docker build --progress=plain -t test .
```

### Problem: Service startet nicht
```bash
# Logs checken
gcloud run services logs read charakterkompass --limit 100

# Häufige Fehler:
# - Port 8080 nicht exposed
# - nginx nicht im foreground
# - Health-check schlägt fehl
```

---

## 🎉 Fertig!

Nach erfolgreichem Deploy:
1. Service URL in Browser öffnen
2. Charakter-Kompass testen
3. Keine Requests = 0€ Kosten
4. Bei Traffic: automatisches Scaling

**Happy Deploying! 🚀**
