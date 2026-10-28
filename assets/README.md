# Organização dos assets

Estrutura sugerida para o projeto:

- 2d/
  - terrain/ -> chão, grama, pedras, rua, estrada, água
  - props/ -> árvores, muros, casas, cabanas, objetos do mapa
  - characters/ -> sprites e personagens do jogo
- 3d/
  - props/ -> modelos low poly para cenário e elementos detalhados
- ui/ -> barra de vida, ícones, menus e HUD

## Ordem recomendada de uso

1. Terrain e chão
2. Props do mapa (pedras, árvores, muros, cabanas)
3. Personagens e NPCs
4. Detalhes de ambiente e efeitos
5. Itens e sistema de vida/inventário

## Recomendação atual

Para começar, a melhor base é usar 2D para o mapa e props principais, e deixar modelos 3D para detalhes e elementos que precisam chamar atenção. Isso mantém o jogo leve e mais fácil de aprender.
