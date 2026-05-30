/**
 * Shared TypeScript types for the vnStat client frontend.
 *
 * The data shapes mirror the Rust serde structs exposed by the Tauri backend
 * (`src-tauri/src/commands/*` and `vnstat-rs/src/types.rs`). Keep them in sync
 * with the backend — they are the contract for every `invoke()` call.
 */

/* Traffic */
/** A row from the day / month / year / hour tables. `rx`/`tx` are bytes. */
export interface TrafficEntry {
	id: number;
	interface: number;
	/** "YYYY-MM-DD" (day/month/year) or "YYYY-MM-DD HH:00:00" (hour). */
	date: string;
	rx: number;
	tx: number;
}

export interface SummaryData {
	date: string;
	/** Already converted to MB. */
	rx: number;
	/** Already converted to MB. */
	tx: number;
}

export interface SummaryEntry {
	interval: string;
	data: SummaryData;
}

/** All traffic data returned by the `get_traffic` command. */
export interface TrafficData {
	month: TrafficEntry[];
	day: TrafficEntry[];
	year: TrafficEntry[];
	week: TrafficEntry[];
	summary: SummaryEntry[];
}

/** A row from the `interface` table (`get_interfaces`). */
export interface Interface {
	id: number;
	name: string;
	alias: string;
	active: number;
	created: string;
	updated: string;
	rxtotal: number;
	txtotal: number;
}

/** A row from the `info` table (`get_vnstat_info`). */
export interface VnInfo {
	name: string;
	value: string;
}

/* Network stats */
export interface NetworkSpeed {
	rx: number;
	tx: number;
}

export interface NetworkBytes {
	rx: number;
	tx: number;
}

export interface NetworkInterfaceStats {
	speed: NetworkSpeed;
	bytes: NetworkBytes;
	operstate: string;
}

/** Payload of the "send-network-stats" event: `{ [ifaceName]: stats }`. */
export type NetworkStatsPayload = Record<string, NetworkInterfaceStats>;

/* App config */
export interface LineChartConfig {
	hasArea: boolean;
	areaOpacity: number;
	colors: string;
	curve: string;
}

export interface BarChartConfig {
	colors: string;
	isGrouped: boolean;
	layout: string;
}

export interface AppearanceConfig {
	globalTheme: string;
	lineChart: LineChartConfig;
	barChart: BarChartConfig;
}

/** The app's own config (`get_app_config` / `config.json`). */
export interface AppConfig {
	netStatsRefreshTime: number;
	checkUpdatesOnStartup: boolean;
	interface: number;
	appearance: AppearanceConfig;
}

/** `/etc/vnstat.conf` as a flat key→value map (`get_vn_configs`). */
export type VnStatConfig = Record<string, string>;

/** A single pending vnStat config change: `{ [key]: value }`. */
export type VnStatConfigChange = Record<string, string>;

/* Logs */
export interface LogEntry {
	content: string;
	date: string;
	status: string;
}

export interface LogsResult {
	path: string;
	lines: LogEntry[];
}

/* Server */
export interface ServerConnectedResponse {
	is_connected: boolean;
}

export interface ConnectResponse {
	status: string;
	title: string;
	description?: string;
}

/* System */
export interface AppInfo {
	name: string;
	value: string;
}

/* React context values */
export interface ConfigContextValue {
	/** Empty object until `get_app_config` resolves, then a full AppConfig. */
	config: Partial<AppConfig>;
	reloading: () => Promise<void>;
	EditConfig: (key: string, value: unknown) => Promise<void>;
}

export interface ServerContextValue {
	isServerConnected: boolean;
}

/** One recorded network-stats sample with its capture time. */
export interface RecordedNetworkStat {
	stats: NetworkStatsPayload;
	date: string;
}

export interface NetStatsContextValue {
	networkStats: NetworkInterfaceStats | undefined;
	iface: string | undefined;
	recordedNetworkStats: RecordedNetworkStat[];
	recordedNetworkSpeed: NetworkSpeed[];
	isRecording: boolean;
	reset: () => void;
	startRecording: () => void;
	stopRecording: () => void;
}

export interface LogsContextValue {
	GetLogs: () => Promise<void>;
	ClearLogs: () => Promise<void>;
	reloading: () => Promise<void>;
	isLoading: boolean;
	logs: LogsResult;
}

export interface VnStatContextValue {
	traffic: TrafficData;
	configs: VnStatConfig;
	isConfigsLoading: boolean;
	changes: VnStatConfigChange[];
	visualVnConfigs: VnStatConfig;
	isConfigChanged: boolean;
	daemonStatus: boolean;
	interfaces: Interface[];
	interfaceID: number;
	reloading: () => void;
	changeVnStatConfigs: (key: string, value: string) => void;
	resetVnConfigs: () => void;
	saveChanges: () => Promise<void>;
	stopDaemon: () => Promise<void>;
	startDaemon: () => Promise<void>;
	restartDaemon: () => Promise<void>;
	changeInterface: (id: number) => void;
}
