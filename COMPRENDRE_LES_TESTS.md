# Comprendre les Tests Unitaires de votre Projet PWA

Ce document explique le fonctionnement des tests unitaires mis en place, l'architecture choisie, et pourquoi nous avons séparé le code en plusieurs fichiers.

## 1. Qu'est-ce qu'un Test Unitaire ?

Un **test unitaire** est un bout de code qui vérifie le bon fonctionnement d'une **toute petite partie** de votre application (une "unité"), généralement une seule fonction ou une seule classe, de manière isolée.

Imaginez que vous testez une ampoule :
- **Test d'intégration** : Vous vissez l'ampoule dans le salon et appuyez sur l'interrupteur. (Cela teste l'ampoule + le câblage + l'interrupteur + le courant)
- **Test unitaire** : Vous prenez l'ampoule sur un établi et vous lui envoyez du courant directement pour voir si elle s'allume. (Cela teste *uniquement* l'ampoule)

Dans notre cas, nous testons les fonctions d'envoi de messages *sans* lancer toute l'application React ni le serveur.

## 2. Pourquoi avoir créé deux fichiers ?

Nous avons séparé le code en deux pour respecter le principe de **Séparation des Préoccupations** (Separation of Concerns).

### A. `app/utils/roomSocketLogic.ts` (La Logique)
C'est le fichier "Cerveau" pour cette fonctionnalité spécifique.
- **Rôle** : Il contient uniquement les fonctions qui savent *comment* parler au serveur (émettre les événements `chat-join-room`, `chat-msg`, etc.).
- **Pourquoi l'avoir sorti de `page.tsx` ?** :
  - **Testabilité** : C'est beaucoup plus facile de tester une fonction JavaScript simple (`emitJoinRoom`) qu'un composant React complexe qui dépend du navigateur.
  - **Réutilisabilité** : Si demain vous créez une autre page qui a besoin de rejoindre une room, vous pourrez réutiliser ces fonctions.

### B. `__tests__/roomSocketLogic.test.ts` (Le Contrôleur)
C'est le fichier "Juge".
- **Rôle** : Il ne fait rien fonctionner dans l'application. Son seul but est d'attaquer les fonctions du fichier précédent pour vérifier si elles réagissent correctement.
- **Contenu** : Il contient des scénarios (des "it") : "Si je donne X, est-ce que tu fais Y ?".

## 3. À quoi sert le dossier `utils` ?

Le dossier `utils` (pour "Utilities" ou Utilitaires) est un standard dans les projets de développement. Il sert à ranger les fonctions "outils" qui ne sont pas des composants d'interface graphique (pas de HTML/CSS).

Dans votre projet :
- `dateHelper.js` : Outils pour manipuler les dates.
- `notifications.ts` : Outils pour gérer les notifications.
- `roomSocketLogic.ts` : Outils pour gérer la logique des sockets de chat.

Cela permet de garder vos composants React (`page.tsx`) propres : ils s'occupent de l'affichage, et délèguent les calculs ou la logique complexe aux `utils`.

## 4. Comment fonctionnent vos tests exactement ?

Analysons le fonctionnement d'un de vos tests :

```typescript
// 1. On "Mock" (on simule) le socket
let mockSocket = {
  emit: jest.fn(), // "jest.fn()" est un espion. Il ne fait rien, mais il note tout.
};

// 2. Le Test
it("should emit 'chat-join-room' with correct data", () => {
    // Action : On appelle votre fonction avec notre faux socket
    emitJoinRoom(mockSocket, "General", "Toto");

    // Vérification (Assertion) :
    // On demande à l'espion : "Est-ce qu'on t'a appelé avec les bons paramètres ?"
    expect(mockSocket.emit).toHaveBeenCalledWith("chat-join-room", {
        roomName: "General",
        pseudo: "Toto",
    });
});
```

### Le processus :
1. **Simulation (Mocking)** : On crée un faux objet `socket` car on n'a pas de vrai serveur connecté pendant le test.
2. **Exécution** : On lance la fonction `emitJoinRoom` avec ce faux socket. Elle va exécuter son code et appeler `socket.emit(...)`.
3. **Vérification** : Comme `socket.emit` était un espion (`jest.fn`), on peut vérifier après coup s'il a bien été appelé, combien de fois, et avec quels arguments.

Si vous aviez changé la logique pour envoyer `"chat-join-ROOM"` (en majuscules) par erreur, le test aurait échoué en disant :
> *"J'attendais 'chat-join-room', mais j'ai reçu 'chat-join-ROOM'."*


## 5. Zoom sur Jest : Le Chef d'Orchestre

Vous vous demandez "Qui lance ces fonctions ?" ou "Comment Jest sait ce qu'il se passe ?".

Voici le processus étape par étape quand vous tapez `npm test` :

1.  **La Découverte** :
    Jest scanne tout votre projet. Il cherche tous les fichiers qui finissent par `.test.ts` ou `.spec.ts`. Il ignore le reste.

2.  **L'Isolation** :
    Pour chaque fichier de test trouvé, Jest crée un petit environnement vide (comme une page blanche). Il n'y a pas de navigateur, pas de fenêtre, juste du JavaScript pur.

3.  **L'Exécution** :
    Il lit votre fichier `roomSocketLogic.test.ts`.
    - Quand il voit `describe(...)`, il note le titre du chapitre.
    - Quand il voit `it(...)`, il exécute le code à l'intérieur.

4.  **L'Assertion (Le Verdict)** :
    C'est la ligne `expect(result).toBe(true)`.
    - Jest compare la valeur de `result` (obtenue par votre code) avec `true` (ce que vous attendez).
    - **Si c'est pareil** : Il affiche un ✅ vert.
    - **Si c'est différent** : Il arrête tout, affiche un ❌ rouge, et vous dit : *"J'attendais 'true' mais j'ai reçu 'false'"*.


## 6. Et pour les Composants (Vibration, GPS, Batterie) ?

Nous avons créé 3 fichiers de tests supplémentaires dans `__tests__/`.
Mais attendez... **Node.js n'a pas de GPS, ni de vibreur, ni de batterie !** Comment peut-on tester ça ?

C'est là qu'intervient la magie du **Mocking (Simulation)**.

### Le principe du "Faux Navigateur"
Nous utilisons `jsdom` (installé via `jest-environment-jsdom`). C'est un navigateur invisible, entièrement écrit en JavaScript. Il sait ce qu'est une `div`, un `button`, ou le `window.navigator`.

Cependant, il ne simule pas le matériel. C'est nous qui devons le faire dans le test.

### Exemple : Le Test GPS (`GeoLocationBox.test.tsx`)

1.  **On pirate le navigateur** :
    ```typescript
    Object.defineProperty(global.navigator, "geolocation", {
      value: { getCurrentPosition: jest.fn() }
    });
    ```
    On dit à Jest : *"Hé, quand le code demande le GPS, ne cherche pas de satellite. Utilise cette fausse fonction à la place."*

2.  **On injecte un scénario** :
    ```typescript
    // Scénario : Tout se passe bien, on est à Paris
    mockGeolocation.getCurrentPosition.mockImplementation((successCallback) => {
      successCallback({ coords: { latitude: 48.8566, longitude: 2.3522 } });
    });
    ```
    On force la fausse fonction à répondre immédiatement : *"Tiens, voici tes coordonnées (Paris)."*

3.  **On vérifie l'affichage** :
    Le composant React reçoit ces fausses coordonnées, croit qu'elles sont vraies, et affiche le lien Google Maps.
    ```typescript
    expect(screen.getByText("Ouvrir Google Maps")).toBeInTheDocument();
    ```

### Résumé
Nous n'avons pas modifié vos composants (`.tsx`). Ils ne savent même pas qu'ils sont testés.
Nous avons juste créé des fichiers `.test.tsx` qui :
1.  Créent un faux environnement (faux GPS, fausse batterie).
2.  Dessinent le composant dedans (`render`).
3.  Vérifient s'il réagit comme prévu (`expect`).
