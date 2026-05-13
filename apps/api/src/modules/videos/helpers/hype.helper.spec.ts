import { calculateHype, isTutorialTitle } from './hype.helper';

describe('hype.helper', () => {
  describe('isTutorialTitle', () => {
    it('detecta "tutorial" sin importar mayúsculas o minúsculas', () => {
      expect(isTutorialTitle('React avanzado - TuToRiaL')).toBe(true);
      expect(isTutorialTitle('TUTORIAL completo de Next.js')).toBe(true);
      expect(isTutorialTitle('react tips')).toBe(false);
    });

    it('no confunde substrings ("tutorialero" no debería matchear)', () => {
      expect(isTutorialTitle('tutorialero tips')).toBe(false);
    });
  });

  describe('calculateHype', () => {
    it('calcula base (likes + comments) / views', () => {
      const result = calculateHype({
        title: 'Redux explicado',
        views: 100,
        likes: 20,
        comments: 10,
      });
      expect(result.isTutorial).toBe(false);
      expect(result.score).toBeCloseTo(0.3, 4);
    });

    it('multiplica x2 cuando el título contiene "tutorial"', () => {
      const result = calculateHype({
        title: 'TypeScript - Tutorial',
        views: 100,
        likes: 20,
        comments: 10,
      });
      expect(result.isTutorial).toBe(true);
      expect(result.score).toBeCloseTo(0.6, 4);
    });

    it('cuando los comentarios están deshabilitados (null) → 0', () => {
      const result = calculateHype({
        title: 'React tips',
        views: 1000,
        likes: 200,
        comments: null,
      });
      expect(result.score).toBe(0);
      expect(result.isTutorial).toBe(false);
    });

    it('cuando los comentarios están deshabilitados y el título es tutorial → 0', () => {
      const result = calculateHype({
        title: 'Tutorial completo',
        views: 1000,
        likes: 500,
        comments: null,
      });
      expect(result.score).toBe(0);
      expect(result.isTutorial).toBe(true);
    });

    it('protege contra división por cero (views = 0)', () => {
      const result = calculateHype({
        title: 'Stream',
        views: 0,
        likes: 0,
        comments: 0,
      });
      expect(result.score).toBe(0);
    });

    it('protege contra views negativas o no finitas', () => {
      expect(
        calculateHype({ title: 'x', views: -5, likes: 10, comments: 10 }).score,
      ).toBe(0);
      expect(
        calculateHype({ title: 'x', views: Number.NaN, likes: 10, comments: 10 }).score,
      ).toBe(0);
    });
  });
});
