import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import TOPOLOGY from "vanta/dist/vanta.topology.min";
import p5 from "p5"; // ✅ Required for TOPOLOGY effect

const VantaBackground = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      const effect = TOPOLOGY({
        el: vantaRef.current,
        THREE,
        p5: p5, // ✅ Fixes "p52 is not a constructor"
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 100.0,
        minWidth: 100.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xa4a4a4,
        backgroundColor: 0x000000,
      });

      setVantaEffect(effect);
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
        setVantaEffect(null);
      }
    };
  }, [vantaEffect]);

  return (
    <>
      <div
        ref={vantaRef}
        style={{
          width: "100%",
          minHeight: "120vh",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
    </>
  );
};

export default VantaBackground;
