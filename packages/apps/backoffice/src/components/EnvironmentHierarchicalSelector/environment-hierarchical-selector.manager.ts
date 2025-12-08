import type { EnvironmentOption } from '@backoffice/types/environment-option.type'
import type { GroupedEnvironment } from './environment-hierarchical-selector.type'

/**
 * Manager for environment hierarchical selector logic
 * Contains pure functions for environment and label selection management
 */
export class EnvironmentHierarchicalSelectorManager {
  private static readonly SEPARATOR = ':'

  /**
   * Formats an environment and label into a combined string
   * @param environment - Environment name
   * @param label - Label name
   * @returns Formatted string (e.g., "ITG:ITG01")
   */
  private static formatEnvironmentLabel(environment: string, label: string): string {
    return `${environment}${this.SEPARATOR}${label}`
  }

  /**
   * Parses a combined environment:label string into its components
   * @param value - Combined string to parse
   * @returns Object with environment and label, or null if invalid format
   */
  private static parseEnvironmentLabel(value: string): { environment: string; label: string } | null {
    const parts = value.split(this.SEPARATOR)
    if (parts.length !== 2) {
      return null
    }
    return { environment: parts[0], label: parts[1] }
  }

  /**
   * Simple toggle: add or remove a value from the list
   * @param selectedEnvironments - Current selected environments
   * @param value - Value to toggle
   * @param isChecked - New checked state
   * @returns Updated list of selected environments
   */
  private static simpleToggle(
    selectedEnvironments: string[],
    value: string,
    isChecked: boolean,
  ): string[] {
    let newValue = [...selectedEnvironments]
    if (isChecked === true) {
      if (newValue.includes(value) === false) {
        newValue.push(value)
      }
    } else {
      newValue = newValue.filter((v) => v !== value)
    }
    return newValue
  }

  /**
   * Groups available environments with their labels
   * @param availableEnvironments - List of available environments with labels
   * @returns Grouped environments
   */
  static groupEnvironments(
    availableEnvironments: EnvironmentOption[],
  ): GroupedEnvironment[] {
    return availableEnvironments.map((envOption) => ({
      environment: envOption.environment,
      labels: envOption.labels,
    }))
  }

  /**
   * Checks if a specific label within an environment is selected
   * @param selectedEnvironments - List of selected environment strings
   * @param environment - Environment name
   * @param label - Label to check
   * @returns True if label is selected
   */
  static isLabelSelected(
    selectedEnvironments: string[],
    environment: string,
    label: string,
  ): boolean {
    return selectedEnvironments.includes(this.formatEnvironmentLabel(environment, label)) === true
  }

  /**
   * Get parent checkbox state (checked and indeterminate)
   * @param selectedEnvironments - List of selected environment strings
   * @param environment - Environment name
   * @param availableLabels - List of available labels for this environment
   * @returns Object with checked and indeterminate states
   */
  static getParentCheckboxState(
    selectedEnvironments: string[],
    environment: string,
    availableLabels: string[],
  ): { checked: boolean; indeterminate: boolean } {
    if (availableLabels.length === 0) {
      // Environment with no labels: just check if environment itself is selected
      return {
        checked: selectedEnvironments.includes(environment) === true,
        indeterminate: false,
      }
    }

    const selectedCount = availableLabels.filter((label) =>
      this.isLabelSelected(selectedEnvironments, environment, label),
    ).length

    const allSelected = selectedCount === availableLabels.length
    const someSelected = selectedCount > 0 && selectedCount < availableLabels.length

    return {
      checked: allSelected,
      indeterminate: someSelected,
    }
  }

  /**
   * Handles parent checkbox toggle (check all / uncheck all pattern)
   * @param selectedEnvironments - Current selected environments
   * @param environment - Environment name
   * @param isChecked - New checked state
   * @param availableLabels - List of available labels for this environment
   * @returns Updated list of selected environments
   */
  static handleParentToggle(
    selectedEnvironments: string[],
    environment: string,
    isChecked: boolean,
    availableLabels: string[],
  ): string[] {
    if (availableLabels.length === 0) {
      return this.simpleToggle(selectedEnvironments, environment, isChecked)
    }

    let newValue = [...selectedEnvironments]

    if (isChecked === true) {
      // Check all: add all children
      availableLabels.forEach((label) => {
        const childValue = this.formatEnvironmentLabel(environment, label)
        if (newValue.includes(childValue) === false) {
          newValue.push(childValue)
        }
      })
    } else {
      // Uncheck all: remove all children
      availableLabels.forEach((label) => {
        const childValue = this.formatEnvironmentLabel(environment, label)
        newValue = newValue.filter((v) => v !== childValue)
      })
    }

    return newValue
  }

  /**
   * Handles child checkbox toggle
   * @param selectedEnvironments - Current selected environments
   * @param environment - Environment name
   * @param label - Label name
   * @param isChecked - New checked state
   * @returns Updated list of selected environments
   */
  static handleChildToggle(
    selectedEnvironments: string[],
    environment: string,
    label: string,
    isChecked: boolean,
  ): string[] {
    const childValue = this.formatEnvironmentLabel(environment, label)
    return this.simpleToggle(selectedEnvironments, childValue, isChecked)
  }

  /**
   * Handles checkbox toggle for environment or label selection
   * @param selectedEnvironments - Current selected environments
   * @param value - Value to toggle (environment or environment{SEPARATOR}label)
   * @param isChecked - New checked state
   * @param availableEnvironments - List of available environments with labels (optional)
   * @returns Updated list of selected environments
   */
  static handleCheckboxToggle(
    selectedEnvironments: string[],
    value: string,
    isChecked: boolean,
    availableEnvironments?: EnvironmentOption[],
  ): string[] {
    if (availableEnvironments === undefined) {
      return this.simpleToggle(selectedEnvironments, value, isChecked)
    }

    const envOption = availableEnvironments.find((env) => env.environment === value)

    if (envOption !== undefined) {
      return this.handleParentToggle(selectedEnvironments, value, isChecked, envOption.labels)
    }

    const parsed = this.parseEnvironmentLabel(value)
    if (parsed !== null) {
      return this.handleChildToggle(selectedEnvironments, parsed.environment, parsed.label, isChecked)
    }

    return this.simpleToggle(selectedEnvironments, value, isChecked)
  }
}
