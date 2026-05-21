import { AnimatePresence, motion } from "motion/react";
import { 
  Trash2,
  Send, 
  Leaf, 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  Info, 
  X, 
  MessageCircle,
  Phone,
  Map,
  MapPin,
  Volume2,
  VolumeX,
  Mic,
  Calendar,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Sun,
  Moon,
  Maximize,
  Minimize,
  User,
  LogOut
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { chatWithWellnessAI } from "./services/geminiService";

import { YOGA_POSES, type YogaPose } from "./constants/yogaData";
import { ContactForm } from "./components/ContactForm";
import { CONTACT_DATA } from "./constants/contactData";
import { cn } from "./lib/utils";
import { useTTS } from "./hooks/useTTS";
import { useSpeechToText } from "./hooks/useSpeechToText";
import { TreatmentDirectory } from "./components/TreatmentDirectory";
import { Activity } from "lucide-react";
import { useAuth } from "./hooks/useAuth";
import { LoginPage } from "./components/LoginPage";
import { UserProfile } from "./components/UserProfile";

const PATANJALI_LOGO = "https://patanjaliwellness.com/assets/images/Patanjali-Wellness-logo.png";
const OM_LOGO = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlAMBEQACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAGAAEEBQcDAgj/xABDEAABAwMBBAcEBwYGAQUAAAABAgMEAAURBhIhMUEHE1FhcYGRFCKhsRUWIzJCwdEzYnKi4fAkNENSkvHCJTV0g7L/xAAbAQABBQEBAAAAAAAAAAAAAAAAAQMEBQYCB//EAD0RAAEDAgMECAUCBQMFAQAAAAEAAgMEEQUhMRJBUWEGExQicYGRwTKhsdHwM+EVIyRC8TRSYjVDRIKyFv/aAAwDAQACEQMRAD8A3GhCVCEqEJUITFQFCFQ33WFlshU3LlhT4/0Whtr88cPOmZJ449SrCkwqrq8425cTkFQ/WPVN4H/otkTDYV92RNVv8dn+hqvlxIDJqsf4dh9N/qZdo8G/deRpzU04ZumqXkg8URm9n4jGPSoL8QkdvXXb6CH9GmH/ALG/3+q9fUGK5/mrrdHz++//AEpg1chR/G5B8ETB5Lwej207WEypyFdz39KQVEmq6/j9Tva30XoaKlRhm26lubChw6xe2keQIrttbICuTjEcn61Owjlkm6vXVrO01NiXZoD9m6gIV5Hd8TUuPE3DX5pL4PPk5hjPEG4/PJdonSCyw8I2o7dItbx3bRBWg+eM/OrCKuY/VNyYC97dukeJB6FGMObGmx0vxH23mlcFtqyKmhwcLgqkkifE7YeLHmu4OaVcJ6EJUISoQlQhKhCVCEqEKBeLvCs0RUq4PpaaG4Z4qPYBzNcve1gu5P01NLUydXELlA79x1Bq5KlRFGzWT8T7hw46nmfD0HeaqKmvJ7rVoGU9Fh1us/my8Nw/PwKHDumi9MqCYYVMlJ3F9LfWKz/EcD0qvc2R+uSkSUmLV+b+63hew9NfVWDHSRZFrCXW5bQP4lNggehzXHZyo7+jdY0XFj5/dFVtucK6MB6BJbfbzvKDw8Ryrgxkaqlmp5YHbMrbFTDSBqaWNaj1VN+uLk6E6UJiLLDSfwqSDvyOYUfy7KmNYAzZW7w/CoXUAjkGbs+fL0Wn6avjF+tiJjKSg52HEK/CvmAeYqK+MtKyFdRvo5jE7P7K0JSCASN/Cm9lQ1ylRY8tksymUPNK4oWMg0C4zC7ZI+N20w2KE5Wj5FsfVO0lOXCezlUZZKmnO7f+efKpcFY+Mq4ZirKhvV1zNscd4VjYNZB+ULZfWPo66Ddsubm3f4T+XxNXkFWyXI6qJWYSWM66mdtx/MeKLhwqWqdPQhKhCVCEqEJUIVJqjUcPT8DrpGVvrOGGEn3nFfp2mmppmxC5U2goJa2XYZkBqdwCFbRYJd6mpverCFuK3xoKtyGk8d6Tz7vXuz1TVPkdkVcVNdFSxmlochvdvP7c/RVnSubm37MlKym1KGzst7vtOxXlw8DXFPa3NTejYpnOdcfzOfDl7rPY8Z+U6GorLj7h4IbQVH0FSFrZJ44W7UhsOas3dK39pnrV2mVs/uo2j6DfSXChjF6FztkShRbZcZtmnCRCdWw8g4UDwV3KHMUWvkU7U08FZHsvFwfzJbbpu9NX+zomsAJcwUuN5zsLA3j++VNFlivOq6jdRzmJ2m48QsJl7QlP7QwrbVnxzTq9NhI6ppGlgt0gWGM3puNa1pIShtJKkHZUHOJWDyO1vzTdztXXmU1ZI6qdPvJOvDh4WyQDdtdSWbmw03HYk/R7pAfdCkqdWAUFWAcDIJ7e3urvZGfNaalwBr4C9ztnbGg3DW2fO3BGGmJkO7OJuzksKlyEqDMZSwCwgHBCU894yVc93DhTUgsNkaKgroZKa9Ps91up4nmfoETjhUUhVqqr/YIN9iFia2MgfZup++2e0H8qVkhjOSl0dbNSSbcZ8RuKH7JfJ+mbg3ZNTudZFWdmHcDwI4AKP947xvq9o60OAa5WFXRQ1sRqaMWcPib7haClQUMjhVos4noQlQhKhCr73dY1mtz06WvDTQzgcVHkB3muXvDG7RT9NTSVMoij1KBLPGdnSDqvUSCp5w7Nvh8dkfgCQfxHl6+GcqZnTPstDUythZ2ClOQ+J3Hj5f4RpEZWB10nZL6hv2TuQP8AaP151ENtAqFxF7N0TXa2x7rb3oUpG006nB7QeRHeDTkZLTcJyCd9PKJYzmFwsFig2OEmPBaAOPfdUBtuHtJpwuJK7rKyWrk25T5bh4K02R2UoCiIP1/pZi6W56bFZCbgwnbCkDe6kcUntOOFOtV3g2JvpZhG49w/LmhbojnLavMmEVfZPsbYH7ySMfAmlIurrpPA10DZhqDbyKrOkKxrtN9efSg+yTFF1tXIKP3k+u/wNFlMwKubUUojJ7zcvLcVp1j1BGl6fgzFrBddSGuqTvUp0DekDt3E+G+k2LlY2sopIql8VshnfluKFLz0avS7kuTAlsssvLK1tuAktk7zjHEZ8KFd0fSQRQCOVhJAsLe6JNNxGLQpNnVEKHWEqUxIKQoPoJySFYyCCd6eWRjIrl4uMlTV0z6kmp2rh2o4cMuHAok5VGLVXpjTZCVV97tES8292HMRtIWPdVj3kK5KHeKRrix1wpFLVSUsoljOY+fJUGkLtMtFyOl74raWkZgyVHc6jknfz7PAjsrQ0VUJAGlWGJUsVRF26mGX9w4Hj4I7FWKz6ehCZXChCzq4OfXHVvsmdqzWk5d7HXezw3egPbVLiFTnst/CtNAP4ZRdZ/3ZdOTVa2Jf05cXLrj/AAUYliAj8KsblO+fAdwPbVa7uDZ3qHVN7NEIP7jm72b7nmiUDFcAKtT06AkT04GpE9OAIXlwpDayrgEnJPCuw1A1yWRdFjHXaqekNJIZaYWc9m0QEj0z6UNFytv0jk2aJjHakj5BF3SJeLNFtbkC4IEmQ4nabYSrCkHksn8NdGw1VDglJVyzCWE7IGp3eHNDGmdOalshj3iHCjyS42cxXF7K0pOO3gSAKTZIVxiOI4fWbVPI4tsfiAyNvZH0S8y3m/trFcWXBxB6sgnuO1XJbdZqSljbpM0jz+ysW+vewpaAyn/aSFK/QfGuSLKIbDIZqRTJahNTZCF5NNEJUO6zsirtbguLlE+KetjOJ3HaG/Ge/Hriu4ZDG5WWGVgppbP+B2ThyU/Rd9F/szUhYCZLZ6uQjsWP141qIJRKy6i4nRGjqCwfCcx4Igp5V6H9cXk2TTsiS0f8QsBpkfvq3Z8t58qZqJOrjJVjhVJ2uqbGdNT4BBc5temNGRbTH3XO6K2FY45Vja9AQnzrON78hduCvYnNr8QdUO/Tjz8hp66o8tUFFut8aG0PdYaCPHHOmnHaN1np5jNK6R2pN1NFdtCZTinWhInp0BCfFOBqRAnSBq1liK7Z7W5106R9mvq9/Vg8u9R4Y76VxAFgtBg2FOkeKiYWY3PPfb2QnEviNJ2hyDa1Jcusg7UqRxSxjghPJRHbwz20lw0ZK7koXYnUCWbKJug3nmeATaZhxWtrU2p3VGMlz7FK8qXJdHPvA9M+FDR/c5GIzSOtQUQ72/8A4j91bS+lN8uH2K2NpbzuLzhJI8Bw+NBk4KJF0VFh1kmfIKVaulFpx4N3WD1KD/qsKKgnxTx9PSk2gdUzVdF5GtvA+/I/daFGfaksofjuJcacSFIWk5ChQ5qy72OjcWOFiF0pohIoc8TUhLsEoWUZ2mHNwc8FfhPqPmOLA6p2Pq72f68PLeuVtujFxSvq9pt5pWw+w4MLaV2EfmNx5GmpGWXc0D4iL5g6HcfzhqppGajkJlBUfOmekABPuwL0Du5JdH9T/N3Vb4dP3rFXj/67C/8AnD8wfz5LQQc1eLNoD1Ur6X1xZrR95mIkynxyz+HPoP8AlVTiUthshaLDh2bDpqje7uj3VRLe+melGLHJ2mYHLltJG0f5selVrRsxKdCzsuCufvf97fS60kUy0LLr0KeaEiengEienWhIVSXe52SUh+0y7lHbcdSW1I64JUknz3GnRbQqXBT1TS2eOMkDO9slkWoIv1enOWuM0tLiUjblr+88kj8I4JTx4ZPaeVMvGybBbugf2+MVEhy3N3C3HifHLkq6ysQpF0jtXOR7NEKx1rmCcDs3cM8M8qRgBOamVsk0cDnQN2nblp+vNNMXWwR5VmCFGC19khrelbOOCcc92R28KlSx7TbhYvBcSdS1ZZPo85348SgXS2jrhqNKnmVIYiJOyX3BkE9iRzqOyIuzWpxLGoKI7BF3cFb3no0uMGKp+DKROKRlTQb6tWO7ec0roSNFX0vSaCV4ZK3Zvvvf2UnomvK0TXrO4sqZdSXWAfwqH3gPEb/KkbnkmOktE0sbVNGeh8Ny1M7hk1w4LHps5ppwSod1Pa5G0m82jCLnFTwA/wAw3xLZ/KkadxVlQ1DM6ef9N3yO4hTbBd496tjU2NuCty0Hi2ocUmo8jLFR6qlfSymJ/wDkcVT9IsFUjTy5TG6RCWmQ2ocRg7z6b/KlgfsvU/BJQyrDHfC+4Pmimzzk3G1xZqBufaSvwyN9apjtpodxVLUQmCZ0R3EhBmmtmZrTUtyOCltxLCVctwwfggVn8QdtSEc1fV38rD6aDjc+v+VQdGqzcNX3Ger8TTi9/H3ljHwriTJtlbY83qaCKLmPkFqoplqxqen2pE4p0JFBv8v2GyzpW31ZaZUQocjjd8aeGQT9JF1tQyO17kLDE3V0afNvL4x1211fUJzjBydvjxrjb7myvROwt7YJg3drc/RHP0F9b9D2p+MpP0jFHUhazjIBwQT4YP8A3T/V9ZGCNVmxXfwvEpWuHcdnbyuD7Ii+olnVYW7Ytn30DIlAYc2zxVn8uFPCBpbslVf8bqxVGoB13brcEF2y5XPo+vSrbctp63rO0Anhsk/tEfmP+6jhzoXbLtFoKimgxqn6+HKQflj7Fapa/YzCaXb+r9mcTtt9X90hW/I9alWFsljZusEhEvxDW6lEDFcFcLJbWwhjpfLTCdlAedVgcstKJ+JqLa0lgtpO8vwAOdrYf/QWmXYqFrlFPHqj8qYqL9U63BYapJELiOBVFpy5vLf9kfWVgpJQoneCOVVdFO5x6tyrMNq3l3VOz4IlPDvqcQrxAgV9WNc9X9y3XneBwCHv+/8A9d1K4bbVf27fh1/74vm39vZGM2OmXDejLGUutlB8xioYycCqSN5jeHjdmh3ovmpGlUR31YXGfcaKTxG/ax/NWopHjqlZ9IIv60vbo4A+3sq3RrhTpu/zs+84++5/LVDUG8wUvFG3qoIuDWhUvRCtIvMxGfeVGBA8FD9a7l0Vn0nB6iM8/ZaxTbVil6p5qRPTzQkVZqGTa2bW+i8vttxXkFCgpWCrdwA4k+FPCwGakUcc75mmAEuCwZcIexqlofQW9spSghW3x57tnhv40wW5XXpTKkmXqi3O2uVtPVbToi42JVpjQbPKSpTSMqacOy4TxUSDx3niN1T4SwizSvPsVgrBO6Wpba+/dyzRQKkgKqQz0gWBN8sbvVozLjAusEcSQN6fMfHFcTxbbOatcHrzR1QJPdOR+/kgvor1GqLL+hJS/sH1ExyfwL4lPgfn41Cp5LdwrQdI8OD2drjGY18OK1jlUhwWLWYadSJHSvcncZ6vrVZ9E/nUQZyla+uJZgcTeNvco/mXKCxtMyXkAkYUk79x7aYmniYdlxWKlqYWd2RypLdBai3FMpuQhyKAooUk5I3cD4DNV0VOyOTrQ67VX01MyKbrWuu3NSbFdHJkt9p3GDlxvuHDFJBUGVzmlP0NYZ5HNd4jwVT0pwi/p5MtvIdhvJcCk8QDuPzB8qlxnOy2HR+UNq+rOjwQr+w3D6UssObzeaBV3K5/HNRpRZxVZVwdRO+LgVncW4m0zbrGQTj291XHtxVxTPPVrSzwCojieR/YPdWukhnQ15aH3kLfB/41XzfrBRcR/wCowu4hiGui+QGdVtIO4Psrb+AV/wCNOyC7VddIo9uiJ4EH291s4plqwK9U81ImcUEIKlcAMnwp9qQC5svne8XOTdrg9LluqWpayUgnIQOQT2CuHG5XqlFSR00IYwePNefY0/RPt3W+97R1PV45bO1k/wB9tLbu3QJ/6nqbZWvfzso7LzrDyHmHFNutnaStJwUkc6QEg3CkSRskYWOFwV9G2SSqZaIUpZyp6OhwnGMkpBq6YbtBXktTH1U74xuJHzU08K7JTCwHWEFVl1ZMbjkthLvXMlP4dr3hjwPyqnmbsSEL03CZm1eHt2s8rHyyWzaYuyb3ZIs5O5TicOJ7FjcoetS2u223Xn9fSmkqHQndp4bkE9HmJGr9QSCcjaVg9xcP6VEZm4laHHBsUFPHy9h90QTdNvl4riuoWhRyetJ2h586qZ8NcX7TD6rzqbDHF14zrx1XaNY3IsORtvZdWgjZT90bj68aWOjMcbrnMp+CgMUbrnMjyVOZidM22RdZWx1pT1cdlSsdacjOMct1cUVO5pL3KX0ewmWontpf5Dip12nC9aEnyzHdY24q1dW8nBBSM+Y3bjUwCz7LQU0XZsSYzaBs4ZhRui97rNLIQf8AReWkeZ2vzNM1Gqk9IY9muJ4gfb2QPdWVvXy6LbBI9rWN1WEDSWK9ieG08QP+0Ix0ayA/qi1L3ES1kjlsr2gPlUWrGzLdUmKOJZTVA3tHqFmlklqtN8iSljZMd5PWA8hnCh6Zp05hbCsiFTSvYM9oZey+gkKCkhSTkHeDUcZLzAr3TrUiqtWy/YdNXGQFbKksKCT+8RgfE08FLw6LrquNnMLANkkZAOBuz2f3iuV6jtAZK1OoJv1eFjIZ9jC9sHq/fztbXHx/ThTnWO2NjcoAwyHtfa7na8cuGirepc6jr9g9Vt7G3y2sZxTdt6nGRu31d89fJbl0cTPa9IwcnKmQWTv4bJ3D0xVnA+8YXmuOQ9VXyDjn6omzT20qlY30vthOpmFjiuInPkpVV9X8a3vRV16RzeDvYK46HLgVMz7ctW5CkvNjx3K+SfWindkQq/pVTgSMmG/I+X+VA6MJ6YjOobk62twNNodUlG9RGVk49K4jNrlSOkMJkNPC3fcfRepWorhOc2oWsYTSTvCHIymSO77qh8a5c6+9Nw4dFC20tK4niDf6ELh7XqFZz9c7Xj/5iR8NmuCn+qoB/wCI/wBD91WzoCpD7T901Ta3y2AE++p3AHLCU4pBlkpMErYozHT0zmg+A+ZKNJV9auWhLq+l0vBtpUdTwa6sOKIA3JycD3hTRFngqghoXwYlFGRa5Bte9hzPkvPRUNnTbizwVJV8hTM/xBO9JHXrQOQXHQ9rReIE64KQFJfnurQT2HFXVJDeNJjFQ6nlZD/tYApX/tXSdIQdzV1jBad340jeP5SfOomJR2cSPFNf6jB2nfG63kVnetYBt+pp7WzhC3OtR3hW/wCeR5Uwx12grXYPUCaiYScxl6LUOjy8C6adZQtWX4gDLmTv3fdPmMfGuHixWMxqk7NVuto7Me/zRTypWqoWYdLV5Up+PZ21YQgdc9jmfwjy3nzFPblrujNGLOqXeA91VXCHHtXR9HblICLhcJAfSkj3thPDywf5qW1mqXBM6qxZzmHuMFvP/KqnbXEGmETjcIntXWk+zhR6wg4TjHx8K62Bs3upjayU1xi6s7Ntd3H9kQ2C3xr50ezYEUA3KK8ZGzjeTjdjxSCPGnWND4iBqqyvqJaPFmTP+Bwt5fsc156Jrw5GvLltUv8Aw8tBUlPY4BxHiAR5Cinksdld9JaNr4BUDVuXktfz7tStpYZYv0ryA/qvYSc9RHQ2fHer/wAqhVBu9eg9GIy2ivxJ9gvfRK6pGqFoH3Vxl58iKSE95cdJ2A0gdwcPop3RQlv6QvEJ1IKXGgCk8wCQfnRGbEhROkt+qhkG77BC2qNPydP3Jcd1CjHWo9Q7jctP6jnTbhZXeF4jHWwgg94ahUu+uVaZKTb4Mm4zG4sJouvOHASPmewd9CYqaiKnjMkhsEc60ab07pG32BpYU66vrHlf7sbyfNRGPCuG943WYwhzq2vkq3aDT88Fa2pz6D6MTIUQlxbK1p/icJCfmKYd3pQFBqW9sxjYGlwPTVEugYKrdpK3MrGFqQXVbuaiVfIgeVaanbsxAKpxicT10jxpe3pkqrpMiusxYN9ij7e2PBRA5oJGfiB61Hrotpl+CmYDI10j6R+kgt5jRD3SdDROt9vv0T3mlJCFn91W9J+Y86pITYlpVt0dmMMz6R+vuNUMaLv5sF4S84SYrwDb4HIZ3K8v1p4i4srnGMP7ZT2b8QzH281uLb7a2Q8laS2pO0Fg7iOOabGtl50WkHZOqwW9XZU3Ucq5oCVbTxU2FjaGBuTu57gDT2i9Ko6IR0TYHZZZ2+agTZsmdIXImPuPPK4rWcmi91Mhp44GbEYsOSKDe9LjTqY408gz96D9ocjd+06zGeP4fyp3aZs6Kh7DiXbNvr+5r+1vdDVvuEy2SUyLfIcYeAxtIPHxHA021xacldz0kVSzYlFwpn00pF3j3dllLUttwOOpRuQ4ocSOza35H611tZ7SiChvTvpnG7SLDiOXluK3kz2UW3251QQwGeuUongnGalbW9ebCJxk6oZm9l8+Xmeu6XWXOc+8+6VgHkOQ8hgVDcbm69UoqcU8DIhuH+fmifonbUrVCnAPdRGWSfEgV1HrdUvSdwFGG8SPdcrPOTpzpBfVIITH9odZdPYhROD5HZPlSaOS1UJrsJbsZmwI8Rr7rWL3bUXi1SIS1JSHkYCyjb2e8DtpC5YqlndTzNlG7yQinottexhc6YVdo2R8MU2Xq9//AE1VfJrfn91aWazwNFW6a87LC2drrC6tsBYGANnI48NwrhxL8goNXVzYpM1obnpa+XjyWX3SZJ1ZqUKSkpVIcS0yg79hHL8yfOnMmhbKmhjwyiIO4XPM/mSPdWtJnz7LpSJnYWoLfA/C0gYHwB9BXNHH1kl+Ky+Gv6mKbEH6jIeJWhoSEpCUgBI3ADkK0oWZ11XKfFamw3oshAW08goWk8weNI5ocLFdxyOieHsOYzWeada2E3LRV4USpsK9nWfxtHfkd44/9Vm6mIwyXWlrn7RjxODfa/Jw+6ze7W5+03B6FKSQ60rGcblDkR3Guwbi4WzpKllVEJWaFE+kNWCNCcsl3dUILyFNtvjixtDH/Hf5eHBC3eqTFsIL3iqpx3hmRxt7/Xx1rntFX1DpRHhGUyT9m+ytJQtPI5zS3Clx43Rlt3O2TvBvcLvG6P8AUT7myqIhkc1uOpx8MmjJNydIaFguHE+A+6Inujq5JsnsLM+EpXW9bhTBBzjGNvjjyrvdZU7cfhNT1zoyMra+2X1Q3K0DqNgnEEOgHi06k5+OaSyuo8foHjN9vEFdbPoC9T5QRLjmFHH33XSM+ATnefhShqarOkFJEwmI7TvzVW/SHqdr2ZOnrU5tNNAIkOpO47O4IHpv9O2u3v3BQcCwtxf2yYa6Dx3/AGWeUytfotR6ILcW4k25LH7VQZb8E7z8SPSu2myxHSioDpWQjdmfND3SjbjD1IZSf2cxAWO5QASr5A+dIVa9G6kSUnVnVn0Of3XvTPSBNtLCIk1r2yKgBKDtbK0DsB5jx9aQ5rjEOj0dQ8yQnZJ9D9lfyelKGGz7LbpC3Mbg4sJT6jNN7AVbH0XnJ77wByugfUWpbhqB4KmOBLSDlthvchB7e895rsADRaKgwuGiHczPEoi6Oba3EblajuOERoyFJZKhxOPeUPLcO8mmpnZbA3qpx6qdI5tFFmTr7D3RT0fQ3rhNm6onow5NUURkq/A0N35AeXfVvQQ7DdpUuMzNhayhjOTNeZ/PqjrFWCz6Y76EIQ17ZH5LbF4tQxc7edtGyN7iBxT38/iOdRKuDrGXGqucIrGRuNNP+m/I8jxQ/fIUfXOn2rrbEgXGOnZW3neeZQfmD+tULbxO2XaK0o6iTB6owTfAfwH7rMVpUhakLSUqScKSoYIPZUhbZrg4XGivNO6rudgUERnA7Gzkx3d6fLsPhSEA6qrr8Hp6wXdk7iPfitEtXSPZpSQmYHYTnA7adpGe4j8wK52SspU9HqyLNlnDlr6K9b1TYXACm8Qh/E8E/OlAKrnYbWNNjE70KhXDXOn4SCfb0vq5JjjbJ/L410E9DgtdMcmW8ckBal6Qp9zbVGtyDCjK3FQV9osePLy9aXaWmw/o7FAQ+Y7TuG790F1ytMBZd4MR+fMZiRU7bzywlA7/ANKVMVM7IIzI85BfQFktrVptcaCz9xlGCcfePM+Zya5Lty8uqZ3VEzpX6lVet9PDUFoLTeyJbJ22FK4Z5g9xH5UgepmFV5oqjbPwnI/nJYjJYdjPrYkNqbdbOFoWMFJrtekRSslYHMNwVypE4SiXSekpd9fS64lbNvSffeIxt9ye3x/6rh8gYFSYpjMVI0tbm/hw8UWzkjUt0Z0xaB1dpg4Mxxs7t3BA/vjnsp2jpjI+5WfhcaGE10+cr/hB57/zd4rSI0dqMw2ywgIabSEoQkbgBwFX4FhYLLOcXuLnG5K60qRKhCYgdlCFn+orPL03dF6jsDW3HX/n4aeBHEqAH9g7+BNVdbSbQ2mrR0NXHWwijqjYj4XexVferDbtZQRebA4hMwj7RskDbOPurHJffz+NVLXmM7L1Lo8QnwqXs1SLt+nhxCzeXFkQ5C48plxl5BwpC04IqR4LYwzxzMD4zcFceFCesEqEJUIslQhekIW4tKG0KWtRwlKRkqPYKVcve1rSSbALXej/AEibM39IXBIM9xOEo49Sns/iPP0rhz7ZBYHGsW7W7qovgHz/AG4I1G4UyXKhSrklCqbvp613ghVwhturG4OD3VAeI34o60hS6auqaX9J5A4bvRQYui9PRFpUi3NrIOR1xK/gTXJmcVIlxiulFnSHyy+iq77eZNzmfVzSwBeI2ZMpG5DCOBAI4Ef0G/hIpqZ0rrlSqSjjp4+2Vum5u9x/PyyLdNWKJp+2IhRU5xvccI3uK5k1oo4mxtsFTVtbJWTGWTy5BW1OKIlQhKhCVCEykhQwaEIFvmlZtsuC7xpFaWnlb34R+49z3Dt7vTFV1VRB4u0K/pcTiniFNXC43O3hR2J9h1gn2C8RBGuTfull33HEq57CuJ8PhVK5kkJTz4KzDT1tO67DvGnmFQXfo0ltFS7RKQ+jk097q/XgfhXbZ2nVWtL0mjItO23MafnqhmTpi+xv21qlDvSjbHqM06HNOhV1Hi9FJpIPp9VwZsV2eVhq2TFf/Qr9KW4TjsRpWi5kb6hXls6Pr5MWn2hpENvO9TygTjuSP6VwZGhVtR0ipIx3O8eX3K0XTWj7bYQHWkl+XjfIdAyP4Ry+ffTTpb6LJ1+K1FabONm8B78URCm9pVqVckoTUhchR5s2PBjrkS3kMtJ4rWrApAC42CcjifK7ZYLlBr10u2sXlQ9OpXEto9164OJIKhzCR/Z8KsKWhc83Ku209Nhg6yr70m5g9/z1Rjp3T8GwQExoDeObjih7zh7Sfyq+jjbG2wVHWVs1ZJ1kh8tw8FbU4oiVCEqEJUISoQlQhMQOyhCotRaVtl/QDLZKJCR7kho7K0+fMdxpqWFkozU+ixKooz/LOW8HRDao2r9Mgpb2b7ATwBOHkj5n41Uz4cdQrXrMMrfi/lP9W/nopEDXtmecLM0vQJAOFNyWyMHxHDzxVa+ne3JNy4JVNG1HZ7eIRJEnRZiAuLJaeSd4Lawr5UyQ4ahVckMkRs9pHipGRSbSbSzRtITFQAJO4DjRcoVTctT2W2g+13FlKh+BB21egya7EbzuU2DDqqf9NhPyHqVRHV1yvCuq0vZ3nwd3tUj3Wx3/ANmpcVC+TmrD+FwUverZQ3kMypELQ0ifITN1bPXPdBymM2dlpHyz5Y86t4aFjPiTMuMthaYqFmwOO8o1jsNRmksstobaQMJQgYAHcKnAACwVC5xcS5xuSutKkSoQlQhKhCVCEqEJUISoQlQhNjfQhQ59tg3BvYnRGZCexxAOK5cxrviCdhnlhN43Fvghud0daccCnmY70ZY3gsvHcfPOKjupIlbRY/XNFnODhzAQhe4Uiy5EO8XUgcAuTkfKoMtMwK4pallT8cLPT91XRJlymOpbdu9wCVbjsvYNNtgYVMlZTxC7YW+iK7foiBcgk3Cdc5A7HJAIHwqZFSRlU82NTwkiJjW+ARLbtGaetqgqPbWlLG/bey4f5s48qktp4m6BVM+LVtQLPkNuWX0V8EJSAEjAHADlT+5V3NexQhKhCVCEqEJUISoQv//Z";

interface Message {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  { id: 1, label: "Booking Process", query: "What is the process to book a stay at Patanjali Wellness?" },
  { id: 2, label: "Panchkarma", query: "What are the benefits of Panchkarma therapy?" },
  { id: 3, label: "Treatment Fee", query: "What is the cost or fee structure for treatments?" },
  { id: 4, label: "Yoga Sessions", query: "Tell me about the daily yoga schedule." },
];

function YogaCard({ pose }: { pose: YogaPose }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      className="mt-4 w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xl"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={pose.image} 
          alt={pose.name} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
          {pose.hindiName}
        </div>
      </div>
      
      <div className="p-6 relative">
        <div className="absolute top-0 right-6 -translate-y-1/2 p-3 rounded-2xl bg-white dark:bg-stone-800 shadow-xl border border-stone-100 dark:border-stone-700">
           <Leaf className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="serif text-xl font-bold text-green-800 dark:text-green-400">{pose.name}</h3>
            <p className="text-xs text-stone-500 font-medium mt-1">{pose.description}</p>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-all shadow-sm"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-yellow-500" />
              Healing Benefits
            </h4>
            <div className="flex flex-wrap gap-2">
              {pose.benefits.map((benefit, i) => (
                <span key={i} className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-[10px] font-bold rounded-lg border border-green-100 dark:border-green-800">
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 mt-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    Instructions
                  </h4>
                  <div className="space-y-3">
                    {pose.steps.map((step, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <span className="w-5 h-5 shrink-0 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] flex items-center justify-center font-bold text-stone-500 dark:text-stone-400">
                          {i + 1}
                        </span>
                        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function BookingGuide() {
  const steps = [
    {
      icon: <CheckCircle2 className="w-5 h-5 text-orange-500" />,
      text: "Register yourself, generate MR Number (www.hms.patanjaliwellness.com)"
    },
    {
      icon: <Info className="w-5 h-5 text-blue-500" />,
      text: "If already registered, login with your credentials (Login Id & Password)"
    },
    {
      icon: <Calendar className="w-5 h-5 text-green-500" />,
      text: "Generate IPD/OPD booking request"
    },
    {
      icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
      text: "Once request is approved from our BAMS & BNYS Doctors, then book your room."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-6"
    >
      <div 
        style={{ backgroundColor: "#e4f7f5", color: "#000000" }}
        className="p-4 rounded-3xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-3 h-3 text-orange-600" />
          <h3 className="serif text-[10px] font-bold text-stone-500 uppercase tracking-wider">Booking Process</h3>
        </div>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start group">
              <div className="mt-0.5 shrink-0 transition-transform group-hover:scale-110">
                {step.icon}
              </div>
              <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-400 font-medium">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1">
        <div className="text-center">
          <a 
            href="https://hms.patanjaliwellness.com/#/auth/registration" 
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            Sign Up
          </a>
          <p className="text-[8px] text-stone-400 mt-1 uppercase font-bold">For new user</p>
        </div>
        <div className="text-center">
          <a 
            href="https://hms.patanjaliwellness.com/#/auth/login" 
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border border-stone-200 dark:border-stone-700 shadow-sm active:scale-95"
          >
            Login
          </a>
          <p className="text-[8px] text-stone-400 mt-1 uppercase font-bold">Existing user</p>
        </div>
      </div>

      <div className="p-4 rounded-3xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50">
        <div className="flex items-center gap-2 mb-2">
          <Phone className="w-3 h-3 text-indigo-600" />
          <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Booking Query</p>
        </div>
        <a href="tel:8954666111" className="text-sm font-bold text-indigo-700 dark:text-indigo-400 hover:underline">
          8954666111
        </a>
      </div>

      <div className="px-1">
        <a 
          href="https://patanjaliwellness.com/wellness-center.php" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ backgroundColor: "#e7feff" }}
          className="flex items-center justify-between group p-3 rounded-2xl border border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-all text-xs"
        >
          <span className="text-[10px] font-bold text-stone-600 dark:text-stone-400">Nearest Wellness Center</span>
          <Map className="w-4 h-4 text-stone-400 group-hover:text-indigo-600 transition-colors" />
        </a>
      </div>
    </motion.div>
  );
}

function SidebarContent() {
  const treatments = [
    "Yog Therapy", "Ayurved", "Naturopathy", "Panchkarma", 
    "Diet Therapy", "Acupressure", "Acupuncture", 
    "Physiotherapy", "Ozone Therapy"
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-6 pr-1 -mr-1 scrollbar-hide pb-20 lg:pb-0">
        <BookingGuide />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="p-4 rounded-3xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/50"
        >
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-3 h-3 text-green-600" />
            <h3 className="serif text-[10px] font-bold text-stone-500 uppercase tracking-wider">Our Treatments</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {treatments.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] text-stone-600 dark:text-stone-400 font-medium">
                <div className="w-1 h-1 rounded-full bg-green-400" />
                {t}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          style={{ backgroundColor: "#e1e9ff" }}
          className="p-4 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50"
        >
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-3 h-3 text-indigo-600" />
            <h3 className="serif text-[10px] font-bold text-stone-500 uppercase tracking-wider">Support Helpline</h3>
          </div>
          <div className="space-y-3">
            <a 
              href={`tel:${CONTACT_DATA.mainHelpline.replace(/\D/g, '')}`} 
              className="flex items-center justify-between p-3 bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 hover:border-indigo-500 transition-all group"
            >
              <div>
                <p className="text-[10px] font-bold text-stone-900 dark:text-stone-100">{CONTACT_DATA.mainHelpline}</p>
                <p className="text-[8px] text-stone-400 uppercase tracking-wider">Tap to call</p>
              </div>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Phone className="w-3 h-3" />
              </div>
            </a>
            
            {CONTACT_DATA.helpline[0].phones.filter(p => p !== CONTACT_DATA.mainHelpline).map((phone, idx) => (
              <a 
                key={idx}
                href={`tel:${phone.replace(/\D/g, '')}`} 
                className="block text-[10px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline px-1"
              >
                Alt: {phone}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          style={{ backgroundColor: "#fffb99" }}
          className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50"
        >
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3 h-3 text-stone-500" />
            <h3 className="serif text-[10px] font-bold text-stone-500 uppercase tracking-wider">Haridwar HQ</h3>
          </div>
          <a 
            href="https://maps.app.goo.gl/tjSrrsUrQ3VbpKUa6"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[10px] leading-relaxed text-stone-600 dark:text-stone-400 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {CONTACT_DATA.address}
            <span className="block text-[8px] text-stone-400 uppercase tracking-wider mt-1">Tap to view on Map</span>
          </a>
        </motion.div>
      </div>

      <div className="mt-auto p-4 bg-stone-800 dark:bg-stone-900 rounded-2xl text-white shadow-xl">
        <p className="text-[8px] font-bold tracking-widest uppercase opacity-50 mb-1">Root Cause Healing</p>
        <p className="text-[10px] italic leading-tight">"Disease-free lifestyle is the ultimate medicine."</p>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading: authLoading, logout } = useAuth();
  const [isProfileView, setIsProfileView] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "🙏 **Namaste**! Welcome to **Patanjali Wellness**. I am an AI assistant here to help you with information on Ayurveda, Yoga, treatment centers, and registration processes.\n\nPlease share your name first.\n\nAfter knowing your name, I can assist you in **English** or **Hindi** as per your convenience.\n\nPlease tell – **English** or **Hindi**?\n\n---\n\n🙏 **नमस्ते**,\n\n**पतंजलि वेलनेस** में आपका स्वागत है। मैं एक AI सहायक हूँ, जो आपको आयुर्वेद, योग, उपचार केंद्रों की जानकारी और पंजीकरण प्रक्रियाओं में मार्गदर्शन देने में सहायता कर सकता हूँ। \n\nकृपया सर्वप्रथम अपना नाम साझा करें। \n\nआपका नाम जानने के पश्चात, मैं आपकी सहायता **अंग्रेज़ी** या **हिंदी** में कर सकता हूँ – आपकी सुविधानुसार। \n\nकृपया बताएँ – **English** या **Hindi**?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isTreatmentsOpen, setIsTreatmentsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { voices, selectedVoiceIndex, setSelectedVoiceIndex, speak, stop, isSpeaking } = useTTS();
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<number | null>(null);
  const { isListening, transcript, startListening, stopListening, clearTranscript } = useSpeechToText();
  const [hasWarmWelcomed, setHasWarmWelcomed] = useState(false);

  useEffect(() => {
    if (!user) {
      sessionStorage.removeItem("patanjali_welcome_played_v2");
      setHasWarmWelcomed(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && !hasWarmWelcomed) {
      const playWelcome = () => {
        const hasPlayedThisSession = sessionStorage.getItem("patanjali_welcome_played_v2");
        if (hasPlayedThisSession) {
          setHasWarmWelcomed(true);
          return;
        }

        speak(
          "Namaste! Welcome to Patanjali Wellness. I am Patanjali Wellness AI assistant here. How can i help you today.",
          "en",
          () => {
            // Keep track that speech has successfully started playing
            sessionStorage.setItem("patanjali_welcome_played_v2", "true");
            setHasWarmWelcomed(true);
          }
        );
      };

      // Try autoplaying after a short delay (e.g., standard login flow)
      const timer = setTimeout(() => {
        playWelcome();
      }, 1000);

      // interaction fallback: Speaks immediately when the user interacts with the page in case autoplay was blocked by the browser
      const handleFirstInteraction = () => {
        playWelcome();
        cleanup();
      };

      const cleanup = () => {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
      };

      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('touchstart', handleFirstInteraction);
      document.addEventListener('keydown', handleFirstInteraction);

      return () => {
        clearTimeout(timer);
        cleanup();
      };
    }
  }, [user, hasWarmWelcomed, speak]);

  useEffect(() => {
    if (transcript) {
      setInput(prev => prev + (prev ? " " : "") + transcript);
      clearTranscript();
    }
  }, [transcript, clearTranscript]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const responseText = await chatWithWellnessAI(text, history);
      
      const botMessage: Message = {
        role: "model",
        text: responseText || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "model",
        text: "❌ Namaste, I encountered an error. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "model",
        text: "🙏 **Namaste**! Welcome to **Patanjali Wellness**. I am an AI assistant here to help you with information on Ayurveda, Yoga, treatment centers, and registration processes.\n\nPlease share your name first.\n\nAfter knowing your name, I can assist you in **English** or **Hindi** as per your convenience.\n\nPlease tell – **English** or **Hindi**?\n\n---\n\n🙏 **नमस्ते**,\n\n**पतंजलि वेलनेस** में आपका स्वागत है। मैं एक AI सहायक हूँ, जो आपको आयुर्वेद, योग, उपचार केंद्रों की जानकारी और पंजीकरण प्रक्रियाओं में मार्गदर्शन देने में सहायता कर सकता हूँ।\n\nकृपया सर्वप्रथम अपना नाम साझा करें।\n\nआपका नाम जानने के पश्चात, मैं आपकी सहायता **अंग्रेज़ी** या **हिंदी** में कर सकता हूँ – आपकी सुविधानुसार।\n\nकृपया बताएँ – **English** या **Hindi**?",
        timestamp: new Date(),
      },
    ]);
    setInput("");
    clearTranscript();
    stop();
  };

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (isProfileView) {
    return <UserProfile onBack={() => setIsProfileView(false)} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-stone-50 dark:bg-stone-950 transition-colors duration-300 relative">
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-sidebar-bg dark:bg-stone-900 shadow-2xl p-6 flex flex-col gap-6 lg:hidden border-r border-stone-200 dark:border-stone-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center h-12 w-full">
                  <img 
                    src={PATANJALI_LOGO} 
                    alt="Patanjali Wellness" 
                    className="h-full w-full object-contain brightness-110 select-none dark:invert dark:hue-rotate-180"
                  />
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-stone-400 hover:text-orange-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div 
                  onClick={() => {
                    setIsProfileView(true);
                    setIsMobileMenuOpen(false);
                  }}
                  style={{ backgroundColor: "#f9f69f" }}
                  className="p-4 rounded-3xl border border-stone-100 dark:border-stone-700 shadow-xl flex items-center gap-3 font-bold group hover:border-orange-500 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center p-0.5 shadow-sm border border-stone-100">
                    <img 
                      src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.email} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-stone-700 dark:text-stone-200">My Profile</span>
                    <span style={{ color: "#fe0b10" }} className="text-[10px] font-normal">Account Settings</span>
                  </div>
                </div>


              </div>

            <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop) */}
      <aside 
        className="hidden lg:flex w-72 h-full border-r border-stone-200 dark:border-stone-800 p-5 flex-col gap-5 bg-sidebar-bg dark:bg-stone-900 overflow-hidden shrink-0"
      >
        <div className="flex items-center h-14 w-full mb-4 px-2">
          <img 
            src={PATANJALI_LOGO} 
            alt="Patanjali Wellness" 
            className="h-full w-auto object-contain brightness-110 select-none dark:invert dark:hue-rotate-180"
          />
        </div>

        <SidebarContent />
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col relative h-full min-w-0">
        <header className="h-16 lg:h-20 border-b border-stone-200 dark:border-stone-800 px-3 sm:px-6 lg:px-8 flex items-center justify-between relative overflow-hidden group shadow-sm bg-header-bg dark:bg-stone-900/80 backdrop-blur-md shrink-0">
          {/* Header Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-yellow-200/20 to-orange-400/10 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900 z-0" />
          
          <div className="flex items-center gap-2 sm:gap-3 relative z-10">
            <div className="hidden lg:flex p-1 bg-white dark:bg-stone-100 rounded-lg shadow-sm border border-orange-500/20 overflow-hidden w-10 h-10 items-center justify-center">
              <img src={OM_LOGO} alt="Om" className="w-full h-full object-contain" />
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-0.5 bg-white dark:bg-stone-100 rounded-xl transition-all flex items-center justify-center w-10 h-10 overflow-hidden shadow-lg border-2 border-orange-500/30 active:scale-95"
            >
              <img 
                src={OM_LOGO} 
                alt="Om" 
                className="w-full h-full object-contain p-0.5"
              />
            </button>
            <div className="hidden sm:flex flex-col">
              <h2 className="serif text-sm lg:text-base font-bold text-stone-800 dark:text-stone-100">Wellness AI</h2>
              <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Patanjali Official</span>
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:block h-full py-1.5 lg:py-2">
            <img 
              src={PATANJALI_LOGO} 
              alt="Patanjali Wellness Logo" 
              className="h-full w-auto object-contain drop-shadow-xl brightness-110 contrast-110 select-none"
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 relative z-10">
            <button 
              onClick={() => setIsProfileView(true)}
              title="My Profile"
              className="hidden sm:flex p-2 sm:p-2.5 bg-white/40 dark:bg-stone-800/40 hover:bg-white/60 dark:hover:bg-stone-800/60 backdrop-blur-md rounded-full text-stone-600 dark:text-stone-300 shadow-sm"
            >
              <User className="w-3.5 h-3.5 sm:w-4 h-4" />
            </button>
            <button 
              onClick={handleClearChat}
              title="Clear Everything"
              className="p-2 sm:p-2.5 bg-red-500 hover:bg-red-600 rounded-full text-white hover:scale-110 transition-all shadow-lg"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 sm:p-2.5 bg-white/40 dark:bg-stone-800/40 hover:bg-white/60 dark:hover:bg-stone-800/60 backdrop-blur-md rounded-full text-stone-600 dark:text-stone-300 shadow-sm"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 h-4" />}
            </button>
            <button 
              onClick={toggleFullScreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              className="hidden sm:flex p-2.5 bg-white/30 dark:bg-stone-800/30 hover:bg-white/50 dark:hover:bg-stone-800/50 backdrop-blur-md rounded-full text-stone-600 dark:text-stone-300 transition-all shadow-sm items-center justify-center"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
            <button 
              onClick={logout}
              title="Logout"
              className="p-2 sm:p-2.5 bg-white/40 dark:bg-stone-800/40 hover:bg-white/60 dark:hover:bg-stone-800/60 backdrop-blur-md rounded-full text-stone-600 dark:text-stone-300 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 h-4" />
            </button>

            <button 
              onClick={() => setIsContactFormOpen(true)}
              className="flex items-center gap-2 px-4 lg:px-6 py-2 sm:py-2.5 text-[9px] lg:text-[10px] font-bold uppercase tracking-widest bg-orange-600 text-white rounded-full hover:bg-orange-700 shadow-lg hover:scale-105 transition-all outline outline-2 outline-white/20"
            >
              <Calendar className="w-3 h-3 hidden xs:block" />
              <span className="hidden xs:inline">Book Treatment</span>
              <span className="inline xs:hidden">Book</span>
            </button>
          </div>
        </header>
        
        {/* Scrolling Announcement */}
        <div 
          style={{ backgroundColor: "#fdf8ff", color: "#0ad3f8" }}
          className="bg-indigo-600 dark:bg-indigo-900 text-white py-2 overflow-hidden whitespace-nowrap relative z-10 shadow-sm"
        >
          <motion.div
            animate={{ x: ["10%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="inline-block"
          >
            <a 
              href="https://whatsapp.com/channel/0029VbCrqZVJpe8jL7YLBP00" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-4 font-bold text-[11px] md:text-sm tracking-wide hover:underline decoration-white/50"
            >
              <span style={{ backgroundColor: "#f8f4f4", color: "#9a4545", borderStyle: "none" }}>॥ॐ॥ पतंजलि वेलनेस के आधिकारिक WhatsApp चैनल 🔗 से जुड़ने के लिए क्लिक ☑️ करे । 👉 कृपया चैनल को Follow अवश्य करें 🙏 </span>
            </a>
          </motion.div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          {/* Background Image Layer - Scoped to Middle */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.45] dark:opacity-[0.00] pointer-events-none"
            style={{ 
              backgroundImage: 'url("https://images.jansatta.com/2024/04/Acharya-balkrishna-baba-ramdev-1.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          <div className="absolute inset-0 overflow-y-auto p-4 sm:p-10 space-y-8 pb-24 lg:pb-10 bg-white/40 dark:bg-stone-950/60 backdrop-blur-[1px] z-10">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-start gap-3 sm:gap-4 max-w-[95%] sm:max-w-[85%]",
                    message.role === "user" ? "self-end flex-row-reverse" : "self-start"
                  )}
                >
                  <div className={cn(
                    "w-11 h-11 rounded-full shrink-0 flex items-center justify-center shadow-lg overflow-hidden",
                    message.role === "user" ? "bg-stone-100" : "bg-white border border-stone-200 dark:border-stone-700"
                  )}>
                    {message.role === "user" ? (
                      <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                        <User className="text-white w-6 h-6" />
                      </div>
                    ) : (
                      <img 
                        src="https://patanjaliyogacertification.org/img/yogalevel/patanjali.png" 
                        alt="Patanjali" 
                        className="w-full h-full object-contain p-1"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div 
                      className={cn(
                        "p-5 px-6 text-[14px] leading-relaxed",
                        message.role === "user" 
                          ? "bubble-user" 
                          : "bubble-bot"
                      )}
                    >
                      <div className="markdown-body">
                        <ReactMarkdown>
                          {message.text.replace(/\[YOGA:([a-z-]+)\]/g, "")}
                        </ReactMarkdown>
                      </div>

                      {message.role === "model" && (
                        <button 
                          onClick={() => {
                            if (currentlySpeakingId === index && isSpeaking) {
                              stop();
                              setCurrentlySpeakingId(null);
                            } else {
                              speak(message.text);
                              setCurrentlySpeakingId(index);
                            }
                          }}
                          style={{ backgroundColor: "#dbf4f7" }}
                          className={cn(
                            "mt-3 p-1.5 rounded-lg transition-all float-right",
                            currentlySpeakingId === index && isSpeaking 
                              ? "bg-indigo-500 text-white" 
                              : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-stone-800"
                          )}
                        >
                          {currentlySpeakingId === index && isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                    
                    {message.role === "model" && message.text.match(/\[YOGA:([a-z-]+)\]/) && (
                      <div className="flex flex-col gap-4">
                        {Array.from(message.text.matchAll(/\[YOGA:([a-z-]+)\]/g)).map((match, i) => {
                          const poseId = match[1];
                          const pose = YOGA_POSES[poseId];
                          return pose ? <YogaCard key={i} pose={pose} /> : null;
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-white shrink-0 flex items-center justify-center text-lg border border-stone-200 dark:border-stone-700 animate-pulse overflow-hidden shadow-lg">
                    <img 
                      src="https://patanjaliyogacertification.org/img/yogalevel/patanjali.png" 
                      alt="Loading" 
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="bg-white dark:bg-stone-900 p-4 px-6 rounded-2xl flex gap-1 items-center border border-stone-100 dark:border-stone-800 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-6 relative overflow-hidden bg-white/40 dark:bg-stone-950/60 backdrop-blur-md border-t border-stone-200 dark:border-stone-800">
          {/* Footer Gradient Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 via-transparent to-orange-400/5 dark:from-stone-900 dark:via-transparent dark:to-stone-900 z-0" />
          
          <div className="max-w-4xl mx-auto space-y-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide sm:justify-center sm:flex-wrap"
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSend(s.query)}
                  className="whitespace-nowrap text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-900/50 text-stone-600 dark:text-stone-400 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 transition-all hover:border-green-500/30 shadow-sm"
                >
                  {s.label}
                </button>
              ))}
            </motion.div>

              <div className="relative group">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
                  placeholder="Ask wellness query..." 
                  className="w-full h-12 sm:h-16 pl-4 sm:pl-6 pr-32 sm:pr-44 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 text-xs sm:text-sm transition-all dark:text-stone-100 shadow-inner group-hover:border-green-400/50"
                />
                <div className="absolute right-1.5 top-1.5 bottom-1.5 flex gap-1 sm:gap-2">
                  <button 
                    onClick={() => isListening ? stopListening() : startListening('hi-IN')}
                    className={cn(
                      "h-9 sm:h-auto aspect-square sm:w-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all shadow-sm",
                      isListening 
                        ? "bg-red-500 text-white animate-pulse" 
                        : "bg-white dark:bg-stone-800 text-blue-600 dark:text-blue-400 border border-stone-100 dark:border-stone-700"
                    )}
                  >
                    <Mic className="w-4 h-4 sm:w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleSend(input)}
                    disabled={!input.trim() || isLoading}
                    className="h-9 sm:h-auto px-4 sm:px-8 rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5 sm:w-4 h-4" />
                    <span className="hidden xs:inline">Send</span>
                  </button>
                </div>
              </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isContactFormOpen && (
          <ContactForm onClose={() => setIsContactFormOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTreatmentsOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 lg:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTreatmentsOpen(false)}
              className="absolute inset-0 bg-stone-950/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl h-[80vh] z-10"
            >
              <button 
                onClick={() => setIsTreatmentsOpen(false)}
                className="absolute -top-12 right-0 sm:-right-12 p-3 text-white hover:text-green-400 transition-colors bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>
              <TreatmentDirectory />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.a
        href="https://wa.me/918954666111?text=Hello%20I%20have%20a%20query%20regarding%20Patanjali%20Wellness%20booking."
        target="_blank"
        rel="noopener noreferrer"
        drag
        dragConstraints={{ left: -window.innerWidth + 100, right: 0, top: -window.innerHeight + 100, bottom: 0 }}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-[100] flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl shadow-green-500/40 group cursor-grab active:cursor-grabbing"
        title="Chat on WhatsApp"
        id="floating-whatsapp"
      >
        <div className="relative">
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          <MessageCircle className="w-7 h-7 fill-current" />
        </div>
      </motion.a>
    </div>
  );
}
