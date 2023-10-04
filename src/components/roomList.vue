<template>
    <div v-for="room in rooms" :key="room.id" class="col-lg-4 col-md-6">
      <RoomItem :room="room" />
    </div>
</template>

<script>
import RoomItem from './roomItem.vue'; // Correct import name
import { rooms } from './roomData';

export default {
  data() {
    return {
      rooms: rooms,
    };
  },
  components: {
    RoomItem, //
  },
};
</script>
../store/roomData