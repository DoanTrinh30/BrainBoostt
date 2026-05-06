# BrainBoost

Welcome to the BrainBoost project! This document will guide you through the setup process and explain our development workflow.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Git
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/thanhdong200425/BrainBoost.git
   cd BrainBoost
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` (or the port specified in your configuration).

## Development Workflow

### Branching Strategy

Our `master` branch is protected and requires pull requests before merging. Follow these steps to contribute(push code):

1. Create your own development branch:

   ```bash
   git checkout -b development-yourname
   ```

   Always prefix your branch with `development-` followed by your name.

2. Make your changes and commit them:

   ```bash
   git add .
   git commit -m "Descriptive message about your changes"
   ```

3. Push your branch to the remote repository:

   ```bash
   git push -u origin development-yourname
   ```

4. Create a Pull Request (PR) on GitHub from your branch to `master`.

5. Wait for code review and approval from maintainers.

6. Once approved, your changes will be merged into the `master` branch.

### Keep Your Branch Updated

To keep your development branch up to date with the `master` branch:

```bash
git checkout master
git pull
git checkout development-yourname
git merge master
```

Resolve any conflicts that may arise during the merge.
