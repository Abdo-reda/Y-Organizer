<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'

</script>

<template>
    <FunctionCard title="Test">
        <template #default>
            <Carousel class="bg-red-50">
                <CarouselContent class="bg-blue-50">
                    <CarouselItem class="bg-amber-50">
                        <p class="text-lg"> stuff and things and blah 0 </p>
                        <p class="text-lg"> stuff and things and blah 1 </p>
                        <p class="text-lg"> stuff and things and blah 2 </p>
                        <p class="text-lg"> stuff and things and blah 3 </p>
                        <p class="text-lg"> stuff and things and blah 4 </p>
                        <p class="text-lg"> stuff and things and blah 5 </p>
                        <p class="text-lg"> stuff and things and blah 6 </p>
                        <p class="text-lg"> stuff and things and blah 7 </p>
                        <p class="text-lg"> stuff and things and blah 8 </p>
                        <p class="text-lg"> stuff and things and blah 9 </p>
                        <p class="text-lg"> stuff and things and blah 10 </p>
                        <p class="text-lg"> stuff and things and blah 11 </p>
                    </CarouselItem>
                    <CarouselItem class="bg-purple-50">
                        <p class="text-lg"> why and how 0 </p>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </template>
    </FunctionCard>
</template>