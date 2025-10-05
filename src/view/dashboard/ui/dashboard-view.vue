<script setup lang="ts">
import HandIcon from '@/assets/icons/hand-icon.vue'
</script>

<template>
  <div class="container">
    <div>
      <span class="message">Welcome back, Sundar</span>
      <HandIcon />
    </div>
    <div class="content">
      <div class="todo"></div>
      <div class="info">
        <div class="tasks-info"></div>
        <div class="completed-tasks"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 0 76px;
  margin-top: 57px;
  width: 100%;
}

.message {
  color: #000;
  font-size: 36px;
  font-style: normal;
  font-weight: 500;
  line-height: 34px; /* 94.444% */
  margin-right: 12px;
  margin-bottom: 34px;
}

.content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: 1px solid rgba(161, 163, 171, 0.63);
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  padding: 24px;
  height: calc(100vh - 171px);
}

.todo {
  display: flex;
  width: 466px;
  padding: 20px 23px 46px 23px;
  flex-direction: column;
  align-items: center;
  border-radius: 14px;
  background: #f5f8ff;
  box-shadow:
    0 121px 34px 0 rgba(0, 0, 0, 0),
    0 77px 31px 0 rgba(0, 0, 0, 0.01),
    0 44px 26px 0 rgba(0, 0, 0, 0.02),
    0 19px 19px 0 rgba(0, 0, 0, 0.03),
    0 5px 11px 0 rgba(0, 0, 0, 0.04);
}

.info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tasks-info {
  width: 426px;
  height: 263px;
  flex-shrink: 0;
  border-radius: 14px;
  background: #f5f8ff;
  box-shadow:
    0 71px 20px 0 rgba(0, 0, 0, 0),
    0 45px 18px 0 rgba(0, 0, 0, 0.01),
    0 26px 15px 0 rgba(0, 0, 0, 0.02),
    0 11px 11px 0 rgba(0, 0, 0, 0.03),
    0 3px 6px 0 rgba(0, 0, 0, 0.04);
}

.completed-tasks {
  width: 423px;
  height: 436px;
  flex-shrink: 0;
  border-radius: 14px;
  background: #f5f8ff;
  box-shadow:
    0 71px 20px 0 rgba(0, 0, 0, 0),
    0 45px 18px 0 rgba(0, 0, 0, 0.01),
    0 26px 15px 0 rgba(0, 0, 0, 0.02),
    0 11px 11px 0 rgba(0, 0, 0, 0.03),
    0 3px 6px 0 rgba(0, 0, 0, 0.04);
}
</style>
