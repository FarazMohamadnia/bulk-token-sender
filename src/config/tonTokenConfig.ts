export type TonToken = {
    Jetton: string;
    name: string;
    decimal: number;
    reciverAddress: string;
  };
  
  export type TonTokensType = {
    [key: string]: TonToken;
  };
  
  export const TonTokens: TonTokensType = {
    USDT: {
      Jetton:
        "0:B113A994B5024A16719F69139328EB759596C38A25F59028B146FECDC3621DFE",
      name: "USDT",
      decimal: 1000000,
      reciverAddress: "",
    },
    NOT: {
      Jetton:
        "0:2F956143C461769579BAEF2E32CC2D7BC18283F40D20BB03E432CD603AC33FFC",
      name: "NOT",
      decimal: 1000000000,
      reciverAddress: "",
    },
    DOGS: {
      Jetton:
        "0:AFC49CB8786F21C87045B19EDE78FC6B46C51048513F8E9A6D44060199C1BF0C",
      name: "DOGS",
      decimal: 1000000000,
      reciverAddress: "",
    },
  };
  