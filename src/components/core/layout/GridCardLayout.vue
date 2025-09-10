<script setup lang="ts">
import { ICardStructure } from "@/core/interfaces/entities/ICardStructure";
import { GridStack } from "gridstack";
import { onMounted } from "vue";

//TODO: editable layout
//- https://github.com/SortableJS/vue.draggable.next
//- https://swapy.tahazsh.com/docs/framework-vue/ //========> The project is already under GPL license... so...
//- https://github.com/haltu/muuri
//- https://github.com/gridstack/gridstack.js/
interface IGridCardLayoutProps {
  layout: ICardStructure[];
}

defineProps<IGridCardLayoutProps>();

onMounted(() => {
  let grid = GridStack.init({
    alwaysShowResizeHandle: false,
    margin: "0.5rem",
    column: 12,
    row: 12,
	// layout
    // cellHeight: 'auto',
    // cellHeightThrottle
    // cellHeightUnit
  });
});
</script>

<template>
  <div class="grid-stack h-80">
    <template v-for="(card, index) in layout" :key="index">
      <!-- :gs-x="card.row" :gs-y="card.col" -->
      <div class="grid-stack-item" :gs-w="card.width" :gs-h="card.height">
        <component class="grid-stack-item-content" :is="card.component" />
      </div>
    </template>
  </div>
</template>
