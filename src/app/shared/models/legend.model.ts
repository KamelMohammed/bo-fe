export interface Legend {
  title?: string;
  actions?: string[];
  actionIcon?: { [key: string]: string };
  actionDescription?: { [key: string]: string };
}

export interface LegendExtended extends Legend {
  actionIconClass?: { [key: string]: string };
}
