# Pennywise

## Current State

Pennywise is a service marketplace platform with:
- A Motoko backend with users, services, bookings, and messaging.
- A React frontend with Provider and Taker dashboards, a Contact page with a virtual assistant (text message form), and a booking flow.
- No calling functionality exists. The "communication" feature is limited to sending text messages via `sendMessage`.

## Requested Changes (Diff)

### Add

- **`useCallAgent` hook** (`src/hooks/useCallAgent.ts`): Encapsulates the entire calling lifecycle using a `CallAgent`-style API. Manages:
  - Initializing a `CallAgent` instance (using WebRTC under the hood).
  - `startCall(calleeId)` -- initiates an outgoing call.
  - Incoming call listeners -- detects and surfaces incoming calls via `incomingCall` state.
  - Call management methods on the active `Call` object: `answerCall()`, `rejectCall()`, `toggleMute()`, `toggleHold()`, `endCall()`.
  - State exposed: `callState` (`idle | calling | ringing | connected | on-hold`), `isMuted`, `isOnHold`, `incomingCall`, `activeCall`.

- **`CallManagerContext`** (`src/context/CallManagerContext.tsx`): React context that wraps `useCallAgent` and makes calling state and controls available app-wide.

- **`IncomingCallOverlay` component** (`src/components/calling/IncomingCallOverlay.tsx`): Fixed overlay shown when `incomingCall` is set. Displays caller info with Answer and Reject buttons.

- **`ActiveCallPanel` component** (`src/components/calling/ActiveCallPanel.tsx`): Fixed panel shown during an active call. Displays call duration timer, call state badge, and controls: Mute, Hold, End Call.

- **`StartCallButton` component** (`src/components/calling/StartCallButton.tsx`): Reusable button that triggers `startCall()` from context, accepts a `calleeId` prop.

- Wire `CallManagerProvider` into `App.tsx` wrapping the `RouterProvider`.
- Add `IncomingCallOverlay` and `ActiveCallPanel` into the root layout so they render app-wide.
- Expose a "Call" action on Provider and Taker dashboards using `StartCallButton`.

### Modify

- `App.tsx`: Wrap app tree with `CallManagerProvider`, render `IncomingCallOverlay` and `ActiveCallPanel` at root level.
- `ProviderDashboard.tsx`: Add a "Start Call" button for client communication using `StartCallButton`.
- `TakerDashboard.tsx`: Add a "Call Provider" button on service/provider cards using `StartCallButton`.

### Remove

- Nothing removed.

## Implementation Plan

1. Create `src/hooks/useCallAgent.ts` with full WebRTC-based calling logic modelling the CallAgent pattern (initCall, incomingCall listener, answerCall, rejectCall, toggleMute, toggleHold, endCall).
2. Create `src/context/CallManagerContext.tsx` providing calling state and methods via React context.
3. Create `src/components/calling/IncomingCallOverlay.tsx` for incoming call UI.
4. Create `src/components/calling/ActiveCallPanel.tsx` for in-call controls and timer.
5. Create `src/components/calling/StartCallButton.tsx` as a reusable trigger component.
6. Update `App.tsx` to wrap app in `CallManagerProvider` and render overlay/panel globally.
7. Add `StartCallButton` to `ProviderDashboard` and `TakerDashboard`.
8. Validate with typecheck and build.
