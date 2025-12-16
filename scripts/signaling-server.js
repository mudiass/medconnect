#!/usr/bin/env node

import { WebSocketServer } from 'ws';
const port = process.env.SIGNALING_PORT || 4000;
const wss = new WebSocketServer({ port });

console.log(`Signaling server listening on ws://localhost:${port}`);

const rooms = new Map();

wss.on('connection', (ws) => {
  ws.room = null;

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      const { type, room, payload } = data;
      if (type === 'join') {
        ws.room = room;
        if (!rooms.has(room)) rooms.set(room, new Set());
        rooms.get(room).add(ws);
        console.log(`Client joined room ${room} (count=${rooms.get(room).size})`);
        rooms.get(room).forEach((s) => {
          if (s !== ws && s.readyState === WebSocket.OPEN) s.send(JSON.stringify({ type: 'peer-joined' }));
        });
        if (rooms.get(room).size >= 2) {
          rooms.get(room).forEach((s) => {
            if (s.readyState === WebSocket.OPEN) s.send(JSON.stringify({ type: 'ready' }));
          });
        }
      } else if (type === 'signal') {
        if (!ws.room) return;
        const set = rooms.get(ws.room) || new Set();
        set.forEach((s) => {
          if (s !== ws && s.readyState === WebSocket.OPEN) {
            s.send(JSON.stringify({ type: 'signal', payload }));
          }
        });
      }
    } catch (err) {
      console.warn('Bad message', err, String(msg));
    }
  });

  ws.on('close', () => {
    if (ws.room && rooms.has(ws.room)) {
      rooms.get(ws.room).delete(ws);
      if (rooms.get(ws.room).size === 0) rooms.delete(ws.room);
    }
  });
});
