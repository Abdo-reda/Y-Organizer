<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import { Button } from '@/components/ui/button';
import useDaySessions from '@/store/useDaySessions';
import useDayState from '@/store/useDayState';
import useSettings from '@/store/useSettings';
import { FocusIcon } from 'lucide-vue-next';
import { DateTime } from 'luxon';
import { computed } from 'vue';
import NowCardView from './subcards/NowCardView.vue';
import SummaryCardView from './subcards/SummaryCardView.vue';

const { appView } = useSettings();
const { selectedDay } = useDayState();
const { currentSession } = useDaySessions();

const isToday = computed(() => selectedDay.value.hasSame(DateTime.now(), "day"));

</script>

<template>
	<FunctionCard :title="isToday ? 'Now' : 'Summary'" :highlight="!!currentSession">
		<template #header-right-actions>
			<div v-if="isToday" class="flex justify-end gap-1">
				<Button @click="appView = 'now'" variant="ghost" size="icon">
					<FocusIcon />
				</Button>
			</div>
		</template>
		<template #default>
            <div class="h-full" v-auto-animate>
                <template v-if="isToday">
                    <NowCardView />
                </template>
                <template v-else>
                    <SummaryCardView />
                </template>
            </div>
		</template>
	</FunctionCard>
</template>
