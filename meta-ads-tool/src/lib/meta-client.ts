const META_API_VERSION = "v21.0";
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

export interface MetaAdAccount {
  id: string;
  name: string;
  account_id: string;
  currency: string;
  timezone_name: string;
  account_status: number;
}

export interface MetaCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  daily_budget?: string;
  lifetime_budget?: string;
  created_time: string;
  updated_time: string;
}

export interface MetaInsight {
  campaign_id?: string;
  campaign_name?: string;
  impressions: string;
  clicks: string;
  spend: string;
  reach: string;
  cpc: string;
  cpm: string;
  ctr: string;
  actions?: MetaAction[];
  cost_per_action_type?: MetaAction[];
  date_start: string;
  date_stop: string;
}

export interface MetaAction {
  action_type: string;
  value: string;
}

interface MetaApiError {
  error: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}

export class MetaAdsClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${META_BASE_URL}${endpoint}`);
    url.searchParams.set("access_token", this.accessToken);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const res = await fetch(url.toString());
    const data = await res.json();

    if (!res.ok) {
      const error = data as MetaApiError;
      throw new Error(`Meta API Error: ${error.error.message} (code: ${error.error.code})`);
    }

    return data as T;
  }

  async getAdAccounts(userId: string = "me"): Promise<{ data: MetaAdAccount[] }> {
    return this.request(`/${userId}/adaccounts`, {
      fields: "id,name,account_id,currency,timezone_name,account_status",
    });
  }

  async getCampaigns(adAccountId: string): Promise<{ data: MetaCampaign[] }> {
    return this.request(`/${adAccountId}/campaigns`, {
      fields: "id,name,status,objective,daily_budget,lifetime_budget,created_time,updated_time",
      limit: "100",
    });
  }

  async getInsights(
    objectId: string,
    params: {
      datePreset?: string;
      timeRange?: { since: string; until: string };
      level?: "account" | "campaign" | "adset" | "ad";
      timeIncrement?: string;
    } = {}
  ): Promise<{ data: MetaInsight[] }> {
    const fields = [
      "campaign_id",
      "campaign_name",
      "impressions",
      "clicks",
      "spend",
      "reach",
      "cpc",
      "cpm",
      "ctr",
      "actions",
      "cost_per_action_type",
    ].join(",");

    const queryParams: Record<string, string> = { fields };

    if (params.datePreset) {
      queryParams.date_preset = params.datePreset;
    }
    if (params.timeRange) {
      queryParams.time_range = JSON.stringify(params.timeRange);
    }
    if (params.level) {
      queryParams.level = params.level;
    }
    if (params.timeIncrement) {
      queryParams.time_increment = params.timeIncrement;
    }

    return this.request(`/${objectId}/insights`, queryParams);
  }
}

export function createMetaClient(accessToken?: string): MetaAdsClient {
  const token = accessToken || process.env.META_ACCESS_TOKEN;
  if (!token) {
    throw new Error("Meta access token is required. Set META_ACCESS_TOKEN in .env or pass it directly.");
  }
  return new MetaAdsClient(token);
}
