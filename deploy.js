#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Récupérer l'argument
const targetDirArg = process.argv[2];

if (!targetDirArg) {
    console.error('❌ Erreur : Veuillez fournir un chemin de destination.');
    console.error('Usage : node deploy.js /chemin/vers/destination');
    process.exit(1);
}

// --- Configuration ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// -------------------------

const sourceDir = path.resolve(__dirname, 'dist');
const targetDir = path.resolve(targetDirArg);

async function deploy() {
    try {
        // A. Vérifier la SOURCE (dist)
        try {
            await fs.access(sourceDir);
        } catch {
            console.error(`❌ Erreur : Le dossier source "dist" est introuvable. Avez-vous lancé "npm run build" ?`);
            process.exit(1);
        }

        // B. Vérifier la DESTINATION (Le changement est ici)
        try {
            await fs.access(targetDir);
        } catch {
            console.error(`❌ Erreur fatale : Le dossier de destination n'existe pas.`);
            console.error(`   Chemin cherché : ${targetDir}`);
            console.error(`   Veuillez créer le dossier avant de lancer le déploiement.`);
            process.exit(1);
        }

        console.log(`📂 Source : ${sourceDir}`);
        console.log(`📂 Destination : ${targetDir}`);
        console.log('-----------------------------------');

        // C. Lire le contenu de dist
        const entries = await fs.readdir(sourceDir, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(sourceDir, entry.name);
            const destPath = path.join(targetDir, entry.name);

            // Supprimer l'ancien fichier/dossier s'il existe dans la destination
            // (Pour éviter les conflits ou les vieux fichiers)
            await fs.rm(destPath, { recursive: true, force: true });

            // Copier le nouveau
            await fs.cp(srcPath, destPath, { recursive: true });

            console.log(`✅ Copié : ${entry.name}`);
        }

        console.log('-----------------------------------');
        console.log('🚀 Déploiement terminé avec succès !');

    } catch (err) {
        console.error('❌ Une erreur inattendue est survenue :', err);
        process.exit(1);
    }
}

deploy();