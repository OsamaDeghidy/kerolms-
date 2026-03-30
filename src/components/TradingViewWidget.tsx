"use client";

import React, { useEffect, useRef, memo } from 'react';

type TradingViewWidgetProps = {
  symbol?: string;
  theme?: 'light' | 'dark';
  locale?: string;
  autosize?: boolean;
  height?: string | number;
  width?: string | number;
  type?: 'chart' | 'ticker' | 'mini-chart' | 'technical-analysis';
};

function TradingViewWidget({ 
  symbol = "FX:XAUUSD", 
  theme = "dark", 
  locale = "en", 
  autosize = true,
  height = "500px",
  width = "100%",
  type = 'chart'
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    let innerHTML = "";

    if (type === 'chart') {
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      innerHTML = JSON.stringify({
        "autosize": autosize,
        "symbol": symbol,
        "interval": "H",
        "timezone": "Etc/UTC",
        "theme": theme,
        "style": "1",
        "locale": locale,
        "enable_publishing": false,
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      });
    } else if (type === 'ticker') {
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      innerHTML = JSON.stringify({
        "symbols": [
          { "proName": "FOREXCOM:SPX500", "title": "S&P 500" },
          { "proName": "FOREXCOM:NSXUSD", "title": "US 100" },
          { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
          { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
          { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" },
          { "proName": "OANDA:XAUUSD", "title": "Gold" }
        ],
        "showSymbolLogo": true,
        "colorTheme": theme,
        "isTransparent": true,
        "displayMode": "adaptive",
        "locale": locale
      });
    } else if (type === 'mini-chart') {
       script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
       innerHTML = JSON.stringify({
          "symbol": symbol,
          "width": "100%",
          "height": "100%",
          "locale": locale,
          "dateRange": "12M",
          "colorTheme": theme,
          "trendLineColor": "rgba(212, 160, 23, 1)",
          "underLineColor": "rgba(212, 160, 23, 0.3)",
          "underLineBottomColor": "rgba(212, 160, 23, 0)",
          "isTransparent": true,
          "autosize": true,
          "largeChartUrl": ""
       });
    }

    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = innerHTML;
    
    // Clear previous children
    container.current.innerHTML = "";
    container.current.appendChild(script);

    return () => {
      // Cleanup
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [symbol, theme, locale, autosize, type]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: height, width: width }}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default memo(TradingViewWidget);
