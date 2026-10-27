import type { InspirationSpecies } from '../types.js'

export const INSPIRATION_SPECIES: Record<string, InspirationSpecies> = {
  mariana_snailfish: {
    commonName: 'Mariana Snailfish',
    scientificName: 'Pseudoliparis swirei',
    keyAdaptation: 'Possesses high intracellular TMAO piezolyte concentrations, non-calcified cartilaginous cranial elements, and unique piezophilic protein stabilization allowing vertebrate life down to 8,178 m.',
    referenceUrl: 'https://www.nature.com/articles/s41559-019-0864-8',
    citation: 'Gerringer, M. E., et al. (2017). "Pseudoliparis swirei sp. nov.: A newly-discovered hadal snailfish from the Mariana Trench." Zootaxa 4358(1): 161–177.'
  },
  giant_tubeworm: {
    commonName: 'Giant Hydrothermal Tubeworm',
    scientificName: 'Riftia pachyptila',
    keyAdaptation: 'Lacks mouth and digestive tract; houses billions of sulfide-oxidizing endosymbiotic bacteria inside a specialized organ called the trophosome; specialized multi-subunit hemoglobin binds H2S and O2 simultaneously.',
    referenceUrl: 'https://www.mbari.org/animal/riftia-pachyptila/',
    citation: 'Cavanaugh, C. M., et al. (1981). "Prokaryotic Cells in the Trophosome Tissue of Riftia pachyptila: A Possible Symbiosis." Science 213(4505): 340–342.'
  },
  giant_isopod: {
    commonName: 'Deep-Sea Giant Isopod',
    scientificName: 'Bathynomus giganteus',
    keyAdaptation: 'Deep-sea gigantism driven by cold-temperature cell hypertrophy and hyper-efficient metabolic depression, enabling survival on episodic food falls months apart.',
    referenceUrl: 'https://oceanexplorer.noaa.gov/facts/gigantism.html',
    citation: 'Lowry, J. K., & Dempsey, K. (2006). "The giant deep-sea scavenger Bathynomus." Records of the Australian Museum 58(1): 13–48.'
  },
  barreleye: {
    commonName: 'Barreleye Fish',
    scientificName: 'Opisthoproctus soleatus',
    keyAdaptation: 'Tubular, green-pigmented lenses directed upward inside a fluid-filled transparent dome, optimized for filtering silhouette prey against downwelling residual photons and photophore flashes.',
    referenceUrl: 'https://www.mbari.org/animal/barreleye-fish/',
    citation: 'Robison, B. H., & Reisenbichler, K. R. (2008). "Macropinna microstoma and the Anatomy and Function of the Barreleye." Copeia 2008(4): 780–784.'
  },
  viperfish: {
    commonName: "Sloane's Viperfish",
    scientificName: 'Chauliodus sloani',
    keyAdaptation: 'Hinged skull capable of 90-degree cranial elevation, enormous needle teeth locking outside the jaws, and bioluminescent photophores on ventral margins for counterillumination camouflage.',
    referenceUrl: 'https://oceanexplorer.noaa.gov/okeanos/explorations/ex1903/dailyupdates/july2/july2.html',
    citation: 'Sutton, T. T., et al. (2020). "A global biome oceanic mesopelagic review." Frontiers in Marine Science 7: 641.'
  },
  vent_shrimp: {
    commonName: 'Hydrothermal Vent Eyeless Shrimp',
    scientificName: 'Rimicaris exoculata',
    keyAdaptation: 'Lacks compound eyes; instead possesses a fused dorsal photoreceptor organ packed with rhodopsin capable of detecting faint near-infrared geothermal blackbody radiation emitted by 350°C black smokers.',
    referenceUrl: 'https://www.nature.com/articles/337458a0',
    citation: 'Van Dover, C. L., et al. (1989). "A novel eye in \'eyeless\' shrimp from hydrothermal vents of the Mid-Atlantic Ridge." Nature 337: 458–460.'
  },
  tripodfish: {
    commonName: 'Abyssal Tripodfish',
    scientificName: 'Bathypterois grallator',
    keyAdaptation: 'Elongated stiffened pelvic and caudal fin rays forming a tripod stilt structure that perches against soft abyssal sediment, facing upstream into deep currents to catch drifting zooplankton.',
    referenceUrl: 'https://oceanexplorer.noaa.gov/facts/tripodfish.html',
    citation: 'Davis, M. P., & Chakrabarty, P. (2011). "Tripodfish morphology and functional evolution in deep benthic ecosystems." Marine Biology 158: 403–415.'
  },
  vampire_squid: {
    commonName: 'Vampire Squid',
    scientificName: 'Vampyroteuthis infernalis',
    keyAdaptation: 'Extremely high-affinity hemocyanin functioning in sub-0.5 ml/L oxygen minimum zones; deploys retractile sensory filaments to reel in suspended marine snow rather than active pursuit hunting.',
    referenceUrl: 'https://www.mbari.org/animal/vampire-squid/',
    citation: 'Hoving, H. J. T., & Robison, B. H. (2012). "Vampire squid: detritivores in the oxygen minimum zone." Proceedings of the Royal Society B 279(1747): 4559–4567.'
  },
  hadal_amphipod: {
    commonName: 'Supergiant Hadal Amphipod',
    scientificName: 'Alicella gigantea',
    keyAdaptation: 'Grows over 34 cm long (20x standard amphipod size); utilizes membrane fatty-acid desaturase enzymes and high TMAO levels to maintain cell membrane fluidity under 1,000 atmospheres of hydrostatic pressure.',
    referenceUrl: 'https://www.schmidtocean.org/cruise-log-post/creatures-of-the-hadal-zone/',
    citation: 'Jamieson, A. J., et al. (2013). "Morphometry and distribution of hadal amphipods." Deep Sea Research Part I 77: 41–50.'
  },
  pompeii_worm: {
    commonName: 'Pompeii Worm',
    scientificName: 'Alvinella pompejana',
    keyAdaptation: 'Lives in the steep thermal transition gradient (20°C–80°C) immediately adjacent to active chimneys; covered in epibiotic filamentous bacteria that act as thermal insulators and carbohydrate producers.',
    referenceUrl: 'https://www.pnas.org/doi/10.1073/pnas.131110098',
    citation: 'Cary, S. C., et al. (1998). "Alvinella pompejana: A model for animal life at extreme temperatures." Extremophiles 2(3): 143–152.'
  },
  blobfish: {
    commonName: 'Psychrolutid Blobfish',
    scientificName: 'Psychrolutes marcidus',
    keyAdaptation: 'Lacks dense bone structure and swim bladder; body density matches surrounding cold seawater through watery, gelatinous adipose tissue, requiring near-zero energy expenditure to maintain neutral buoyancy.',
    referenceUrl: 'https://australian.museum/learn/animals/fishes/fathead-psychrolutes-aka-mr-blobby/',
    citation: 'Nelson, J. S. (1982). "Two new species of psychrolutid fishes from deep water." Canadian Journal of Zoology 60(6): 1499–1504.'
  }
}
