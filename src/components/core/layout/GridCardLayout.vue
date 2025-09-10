<script setup lang="ts">
import { ICardStructure } from "@/core/interfaces/entities/ICardStructure";

//TODO: editable layout
//- https://github.com/SortableJS/vue.draggable.next
//- https://swapy.tahazsh.com/docs/framework-vue/ //========> The project is already under GPL license... so...
//- https://github.com/haltu/muuri
//- https://github.com/gridstack/gridstack.js/
interface IGridCardLayoutProps {
  layout: ICardStructure[];
}

defineProps<IGridCardLayoutProps>();
</script>

<template>
  <div class="grid grid-cols-12 grid-rows-12 gap-2 h-full">
    <template v-for="(card) in layout" :key="index">
      <component
        :style="{ 'grid-column': `${card.row} / span ${card.width}`, 'grid-row': `${card.col} / span ${card.height}` }"
        :is="card.component"
      />
    </template>
  </div>
</template>
