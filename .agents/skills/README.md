# Skills del Proyecto (NASA Challenge 2026)

Esta carpeta (`.agents/skills/`) es detectada automáticamente por Antigravity para cargar **skills** específicas de este proyecto.

## Cómo agregar una nueva Skill

Crea una subcarpeta por cada skill con un archivo `SKILL.md` obligatorio dentro:

```text
.agents/skills/<nombre-de-la-skill>/
├── SKILL.md          # Obligatorio: Instrucciones principales con frontmatter YAML
├── scripts/          # Opcional: Scripts de ayuda o utilidades
├── examples/         # Opcional: Ejemplos de referencia
├── resources/        # Opcional: Plantillas o recursos adicionales
└── references/       # Opcional: Documentación detallada
```

### Plantilla para `SKILL.md`

```markdown
---
name: nombre-de-la-skill
description: >-
  Describe qué hace esta skill y cuándo debe usarla el agente.
---

# Nombre de la Skill

Instrucciones paso a paso para el agente...
```

