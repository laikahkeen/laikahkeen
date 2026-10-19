// The lazy entry for the server room: three.js and everything built on it.
export { createServerScene, type ServerScene, type Stop } from './scene';
export * from './manifest';
// The replay when the endpoint is unreachable: the server's own payload code, not a copy.
export { getExperience, getProject, listProjects } from '../../mcp/src/payloads.ts';
