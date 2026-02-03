# Image Generation Workflow

## Vue d'ensemble

Ce projet utilise un workflow en deux étapes pour générer et héberger des images pour les articles de blog :

1. **Génération d'image** : Utilise l'API Hugging Face avec le modèle Stable Diffusion 2.1
2. **Hébergement permanent** : Upload automatique sur ImgBB pour obtenir un lien permanent

## Configuration

### Variables d'environnement requises

Ajoutez ces clés dans votre fichier `.env.local` :

```bash
HUGGINGFACE_API_KEY=votre_clé_hugging_face
IMGBB_API_KEY=votre_clé_imgbb
```

### Obtenir les clés API

**Hugging Face** :
- Créez un compte sur [huggingface.co](https://huggingface.co)
- Allez dans Settings → Access Tokens
- Créez un nouveau token avec les permissions de lecture

**ImgBB** :
- Créez un compte sur [imgbb.com](https://imgbb.com)
- Allez dans [API](https://api.imgbb.com/)
- Copiez votre clé API

## Utilisation

### Dans le formulaire de création d'article

Le champ **"Image Prompt"** permet de contrôler la génération d'image :

- **Si rempli** : Utilise le prompt personnalisé pour générer l'image
- **Si vide** : Utilise automatiquement le titre de l'article comme prompt

### Workflow automatique

Lorsqu'un nouvel article est créé :

1. ✅ Le prompt d'image est envoyé à Hugging Face Stable Diffusion 2.1
2. ✅ L'image générée est automatiquement uploadée sur ImgBB
3. ✅ Le lien permanent ImgBB est sauvegardé dans la base de données
4. ✅ L'image est affichée dans l'article

### Gestion des erreurs

Le système inclut un **fallback automatique** :

- Si Hugging Face ou ImgBB échoue, le système utilise automatiquement Pollinations AI
- Les erreurs sont loggées dans la console pour le débogage
- L'utilisateur voit toujours une image, même en cas d'erreur

## Messages d'erreur courants

| Erreur | Cause | Solution |
|--------|-------|----------|
| `HUGGINGFACE_API_KEY is not configured` | Clé API manquante | Ajoutez la clé dans `.env.local` |
| `IMGBB_API_KEY is not configured` | Clé API manquante | Ajoutez la clé dans `.env.local` |
| `Model is loading` | Le modèle Hugging Face est en cours de chargement | Réessayez dans 20-30 secondes |
| `API authentication failed` | Clé API invalide | Vérifiez que vos clés sont correctes |

## Architecture technique

### Fichiers modifiés

1. **`.env.local`** : Ajout des clés API
2. **`src/lib/image-generation.ts`** : Module de génération et upload d'images
3. **`src/app/dashboard/posts/actions.ts`** : Intégration du workflow dans la création de posts

### Flux de données

```
Formulaire (prompt_image)
    ↓
generateNewPost() [actions.ts]
    ↓
generateAndUploadImage() [image-generation.ts]
    ↓
    ├─→ generateImageWithHuggingFace()
    │       ↓
    │   [Image ArrayBuffer]
    │       ↓
    └─→ uploadToImgBB()
            ↓
        [URL permanent]
            ↓
    Sauvegarde dans Supabase
```

## Avantages de cette approche

✅ **Images permanentes** : Les liens ImgBB ne expirent jamais
✅ **Haute qualité** : Stable Diffusion 2.1 produit des images professionnelles
✅ **Contrôle total** : Prompt personnalisable pour chaque article
✅ **Robustesse** : Fallback automatique en cas d'erreur
✅ **Performance** : Les images sont hébergées sur un CDN rapide

## Limitations connues

⚠️ **Temps de génération** : La première requête peut prendre 20-30 secondes (chargement du modèle)
⚠️ **Quota ImgBB** : Plan gratuit limité à 100 uploads/jour
⚠️ **Taille d'image** : Stable Diffusion génère des images 512x512 par défaut

## Développement futur

Améliorations possibles :

- [ ] Cache des images générées pour éviter les duplicatas
- [ ] Support de plusieurs modèles Hugging Face
- [ ] Compression d'image avant upload
- [ ] Génération d'images en arrière-plan (queue system)
- [ ] Interface pour régénérer les images existantes
