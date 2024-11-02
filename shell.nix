let pkgs = import <nixpkgs> {};

shell = pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs
    wrangler
  ];
};

in shell
