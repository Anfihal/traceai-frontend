export interface Alert {
    id?: string;
    rule?: string;
    process?: string;
    command_line?: string;
    node?: string;
    user: string;
    src_ip: string;
    dst_ip: string;
    host?: {
        name: string;
        groups?: string[];
    };
    cmd?: string;
}

export interface Context {
    src: {
        ip: string;
        port: number;
        host_id: string;
    };
    dst: {
        ip: string;
        port: number;
        geo: {
            country: string;
            asn: number;
            org: string;
        };
    };
    proto: string;
    app_proto: string;
    ts: string;
    user: string;
    cmd: string;
    host: {
        name: string;
        groups: string[];
    };
    rpt: {
        verdict: string;
        source: string;
        stats?: any;
        sha256?: string;
        md5?: string;
    };
    att_ck: string[];
    neighbor_alerts: any[];
    historical_similar?: string;
    processes?: any[];
    connections?: any[];
    sha256?: string;
    md5?: string;
    event_type?: string;
}

export interface Hypothesis {
    id: string;
    title: string;
    evidence_for: string[];
    evidence_against: string[];
    status: string;
    att_ck: string[];
    llm_comment?: string;
}

export interface Artifacts {
    ips_to_block: string[];
    hashes: string[];
    processes: string[];
    users_to_investigate: string[];
    hosts: string[];
    warning?: string;
}

export interface Finding {
    id: string;
    time: string;
    type: string;
    value: string;
    comment: string;
}