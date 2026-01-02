useEffect(() => {
  const init = async () => {
    const context = await sdk.context;
    const user = context?.user;

    if (user?.fid) {
      setFid(user.fid);

      const bytes = stringToBytes(user.fid.toString());
      const hash = keccak256(bytes);
      setDna(hash);
    }
  };

  init();
}, []);
