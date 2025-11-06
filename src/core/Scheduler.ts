import { sub, add, formatISO } from 'date-fns'
import mitt, { Emitter } from 'mitt'

export const bus: Emitter<{
  tick: Date;
  hourly: number;
  daily: Date;
  scheduler_start: Date;
  scheduler_stop: Date;
}> = mitt()

export interface SchedulerOptions {
  virtualStepMin?: number     // 默认 1
  speed?: number              // 默认 60
}

export class Scheduler {
  now: Date
  timer?: number
  opts: Required<SchedulerOptions>

  constructor(startAt = new Date(), opts?: SchedulerOptions) {
    this.now = startAt
    this.opts = { virtualStepMin: 1, speed: 60, ...opts }
  }

  start() {
    if (this.timer) return
    this.timer = window.setInterval(() => this.tick(), 1000 / this.opts.speed)
    
    // 发送启动事件
    bus.emit('scheduler_start', this.now)
  }

  stop() {
    clearInterval(this.timer)
    this.timer = undefined
    bus.emit('scheduler_stop', this.now)
  }

  tick() {
    this.now = add(this.now, { minutes: this.opts.virtualStepMin })
    bus.emit('tick', this.now)
    bus.emit('hourly', this.now.getHours())
    bus.emit('daily', this.now)
  }
}