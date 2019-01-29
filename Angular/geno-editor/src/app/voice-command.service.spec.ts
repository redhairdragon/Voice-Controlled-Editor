import { TestBed } from '@angular/core/testing';

import { VoiceCommandService } from './voice-command.service';

describe('VoiceCommandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VoiceCommandService = TestBed.get(VoiceCommandService);
    expect(service).toBeTruthy();
  });
});
